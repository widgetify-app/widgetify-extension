const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform sampler2D u_background;
uniform vec2 u_resolution;
uniform int u_rect_count;
uniform vec4 u_rects[20];
uniform float u_radii[20];
uniform float u_bevels[20];
uniform float u_refractions[20];

float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + vec2(r);
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
    vec2 pixelPos = gl_FragCoord.xy;
    vec2 screenUv = pixelPos / u_resolution;
    vec2 texUv = vec2(screenUv.x, 1.0 - screenUv.y);

    vec2 totalDisplacement = vec2(0.0);
    float totalSpecular = 0.0;
    float totalRim = 0.0;
    float inGlassMask = 0.0;

    vec3 lightDir = normalize(vec3(-0.35, 0.75, 0.65));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    for (int i = 0; i < 20; i++) {
        if (i >= u_rect_count) break;

        vec4 rect = u_rects[i];
        float radius = u_radii[i];
        float bevelWidth = u_bevels[i];
        float refractStrength = u_refractions[i];

        vec2 rectCenter = vec2(rect.x + rect.z * 0.5, u_resolution.y - (rect.y + rect.w * 0.5));
        vec2 halfSize = vec2(rect.z * 0.5, rect.w * 0.5);

        vec2 p = pixelPos - rectCenter;
        float d = sdRoundedBox(p, halfSize, radius);

        if (d <= 0.0) {
            inGlassMask = 1.0;
            float distFromEdge = -d;
            float bevelFactor = clamp(distFromEdge / bevelWidth, 0.0, 1.0);

            float eps = 1.0;
            float dx = sdRoundedBox(p + vec2(eps, 0.0), halfSize, radius) - sdRoundedBox(p - vec2(eps, 0.0), halfSize, radius);
            float dy = sdRoundedBox(p + vec2(0.0, eps), halfSize, radius) - sdRoundedBox(p - vec2(0.0, eps), halfSize, radius);
            vec2 grad = normalize(vec2(dx, dy) + vec2(0.0001));

            float slope = (1.0 - bevelFactor) * (1.0 - bevelFactor);
            vec3 normal = normalize(vec3(grad * slope * 1.8, 1.0));

            vec2 disp = -grad * slope * refractStrength;
            totalDisplacement += disp;

            vec3 halfVector = normalize(lightDir + viewDir);
            float NdotH = max(dot(normal, halfVector), 0.0);
            float spec = pow(NdotH, 32.0) * (1.0 - bevelFactor * 0.7) * 0.5;
            totalSpecular += spec;

            float rim = (1.0 - bevelFactor) * 0.06;
            totalRim += rim;
        }
    }

    if (inGlassMask > 0.5) {
        vec2 uvR = texUv + totalDisplacement * 1.04;
        vec2 uvG = texUv + totalDisplacement * 1.00;
        vec2 uvB = texUv + totalDisplacement * 0.96;

        vec4 colR = texture2D(u_background, uvR);
        vec4 colG = texture2D(u_background, uvG);
        vec4 colB = texture2D(u_background, uvB);

        vec3 refracted = vec3(colR.r, colG.g, colB.b);
        refracted += vec3(totalSpecular);
        refracted += vec3(totalRim);

        gl_FragColor = vec4(refracted, 1.0);
    } else {
        gl_FragColor = texture2D(u_background, texUv);
    }
}
`

export class LiquidGlassRenderer {
    private canvas: HTMLCanvasElement | null = null
    private compositeCanvas: HTMLCanvasElement | null = null
    private compositeCtx: CanvasRenderingContext2D | null = null
    private gl: WebGLRenderingContext | null = null
    private program: WebGLProgram | null = null
    private texture: WebGLTexture | null = null
    private animationFrameId: number | null = null
    private isRunning = false
    private currentBgUrl = ''
    private bgImage: HTMLImageElement | null = null

    private uBackgroundLoc: WebGLUniformLocation | null = null
    private uResolutionLoc: WebGLUniformLocation | null = null
    private uRectCountLoc: WebGLUniformLocation | null = null
    private uRectsLoc: WebGLUniformLocation | null = null
    private uRadiiLoc: WebGLUniformLocation | null = null
    private uBevelsLoc: WebGLUniformLocation | null = null
    private uRefractionsLoc: WebGLUniformLocation | null = null

    public mount() {
        if (this.canvas) return

        this.canvas = document.createElement('canvas')
        this.canvas.id = 'liquid-glass-optical-canvas'
        Object.assign(this.canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: '0',
        })

        document.body.prepend(this.canvas)

        this.compositeCanvas = document.createElement('canvas')
        this.compositeCtx = this.compositeCanvas.getContext('2d', { willReadFrequently: false })

        this.gl = this.canvas.getContext('webgl', {
            alpha: false,
            antialias: true,
            depth: false,
            stencil: false,
            powerPreference: 'high-performance',
        })

        if (!this.gl) return

        this.initShaders()
        this.initBuffers()
        this.initTexture()
        this.resize()

        window.addEventListener('resize', this.handleResize)
        this.start()
        this.syncBackground()
    }

    public unmount() {
        this.stop()
        window.removeEventListener('resize', this.handleResize)

        if (this.canvas) {
            this.canvas.remove()
            this.canvas = null
        }
        this.compositeCanvas = null
        this.compositeCtx = null
        this.gl = null
        this.program = null
        this.texture = null
    }

    public syncBackground() {
        const bg = document.body.style.backgroundImage
        const match = bg.match(/url\(["']?([^"']+)["']?\)/)
        const url = match ? match[1] : ''

        if (!url) {
            this.bgImage = null
            return
        }

        if (url === this.currentBgUrl && this.bgImage) return

        this.currentBgUrl = url
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            this.bgImage = img
        }
        img.onerror = () => {
            this.bgImage = null
        }
        img.src = url
    }

    private handleResize = () => {
        this.resize()
    }

    private resize() {
        if (!this.canvas || !this.gl || !this.compositeCanvas) return
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const width = Math.floor(window.innerWidth * dpr)
        const height = Math.floor(window.innerHeight * dpr)

        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width
            this.canvas.height = height
            this.compositeCanvas.width = width
            this.compositeCanvas.height = height
            this.gl.viewport(0, 0, width, height)
        }
    }

    private initShaders() {
        if (!this.gl) return

        const createShader = (type: number, source: string) => {
            const shader = this.gl!.createShader(type)
            if (!shader) return null
            this.gl!.shaderSource(shader, source)
            this.gl!.compileShader(shader)
            return shader
        }

        const vs = createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
        const fs = createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE)
        if (!vs || !fs) return

        const program = this.gl.createProgram()
        if (!program) return
        this.gl.attachShader(program, vs)
        this.gl.attachShader(program, fs)
        this.gl.linkProgram(program)

        this.program = program
        this.gl.useProgram(program)

        this.uBackgroundLoc = this.gl.getUniformLocation(program, 'u_background')
        this.uResolutionLoc = this.gl.getUniformLocation(program, 'u_resolution')
        this.uRectCountLoc = this.gl.getUniformLocation(program, 'u_rect_count')
        this.uRectsLoc = this.gl.getUniformLocation(program, 'u_rects')
        this.uRadiiLoc = this.gl.getUniformLocation(program, 'u_radii')
        this.uBevelsLoc = this.gl.getUniformLocation(program, 'u_bevels')
        this.uRefractionsLoc = this.gl.getUniformLocation(program, 'u_refractions')
    }

    private initBuffers() {
        if (!this.gl || !this.program) return
        const positionBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            this.gl.STATIC_DRAW
        )

        const aPosition = this.gl.getAttribLocation(this.program, 'a_position')
        this.gl.enableVertexAttribArray(aPosition)
        this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0)
    }

    private initTexture() {
        if (!this.gl) return
        this.texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    }

    public start() {
        if (this.isRunning) return
        this.isRunning = true
        this.renderLoop()
    }

    public stop() {
        this.isRunning = false
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }
    }

    private renderLoop = () => {
        if (!this.isRunning) return
        this.render()
        this.animationFrameId = requestAnimationFrame(this.renderLoop)
    }

    private compositeScreenSpaceScene(dpr: number) {
        if (!this.compositeCtx || !this.compositeCanvas) return

        const ctx = this.compositeCtx
        const width = this.compositeCanvas.width
        const height = this.compositeCanvas.height

        ctx.clearRect(0, 0, width, height)

        if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
            const imgW = this.bgImage.naturalWidth
            const imgH = this.bgImage.naturalHeight
            const canvasAspect = width / height
            const imgAspect = imgW / imgH

            let renderW = width
            let renderH = height
            let offsetX = 0
            let offsetY = 0

            if (canvasAspect > imgAspect) {
                renderH = width / imgAspect
                offsetY = (height - renderH) / 2
            } else {
                renderW = height * imgAspect
                offsetX = (width - renderW) / 2
            }

            ctx.drawImage(this.bgImage, offsetX, offsetY, renderW, renderH)
        } else {
            ctx.fillStyle = '#0a0f1d'
            ctx.fillRect(0, 0, width, height)
        }
    }

    private render() {
        if (!this.gl || !this.program || !this.canvas || !this.compositeCanvas) return

        this.syncBackground()

        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        this.compositeScreenSpaceScene(dpr)

        this.gl.useProgram(this.program)
        this.gl.uniform2f(this.uResolutionLoc, this.canvas.width, this.canvas.height)

        const elements = document.querySelectorAll(
            '.navbar, .widget-wrapper, .bg-glass, .modal-box, .search-box form > div'
        )

        const rects: number[] = []
        const radii: number[] = []
        const bevels: number[] = []
        const refractions: number[] = []

        let count = 0
        const maxRects = 20

        for (let i = 0; i < elements.length && count < maxRects; i++) {
            const el = elements[i] as HTMLElement
            if (!el || el.offsetParent === null) continue

            const rect = el.getBoundingClientRect()
            if (rect.width === 0 || rect.height === 0) continue

            rects.push(rect.left * dpr, rect.top * dpr, rect.width * dpr, rect.height * dpr)

            if (el.classList.contains('navbar') || el.classList.contains('rounded-3xl')) {
                radii.push(24.0 * dpr)
                bevels.push(22.0 * dpr)
                refractions.push(0.028)
            } else if (el.classList.contains('modal-box')) {
                radii.push(20.0 * dpr)
                bevels.push(24.0 * dpr)
                refractions.push(0.032)
            } else {
                radii.push(16.0 * dpr)
                bevels.push(18.0 * dpr)
                refractions.push(0.024)
            }

            count++
        }

        while (rects.length < maxRects * 4) {
            rects.push(0, 0, 0, 0)
            radii.push(0)
            bevels.push(0)
            refractions.push(0)
        }

        this.gl.uniform1i(this.uRectCountLoc, count)
        this.gl.uniform4fv(this.uRectsLoc, new Float32Array(rects))
        this.gl.uniform1fv(this.uRadiiLoc, new Float32Array(radii))
        this.gl.uniform1fv(this.uBevelsLoc, new Float32Array(bevels))
        this.gl.uniform1fv(this.uRefractionsLoc, new Float32Array(refractions))

        this.gl.activeTexture(this.gl.TEXTURE0)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            this.compositeCanvas
        )
        this.gl.uniform1i(this.uBackgroundLoc, 0)

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
    }
}

export const liquidGlassRenderer = new LiquidGlassRenderer()
