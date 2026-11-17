# Share images

The two pictures a person shares: the mood of a month (`src/features/widgets/mood-tracker/`) and the progress of a habit (`src/features/widgets/habit/`). The mobile app (`widgetify-mobile-v2`) has redrawn both, and the extension should draw the same pictures.

**Status:** approved and built in the mobile app (boards C7f and D11f, merged into its `main` on 2026-11-17). Not started in the extension. These files are reference only.

## What is here

| Path | Holds |
|---|---|
| `reference/` | The finished pictures at their real size, 1080 by 1920, drawn from the boards with sample data. Draw to match these |
| `reference/mood-current-month-pro.png` | The current month half done, six rows (1 Aban 1405 is a Friday), a Pro account |
| `reference/mood-full-month.png` | A past month, mostly «عالی‌ام» |
| `reference/mood-few-days.png` | Only four days logged, one mood with 0 days drawn faded |
| `reference/habit-daily-pro.png` | A habit with a short streak, a Pro account |
| `reference/habit-long-streak-pro.png` | A long streak, a Pro account |
| `reference/habit-dark-colour.png` | A habit in a dark colour (`#272c46`) |
| `reference/habit-no-streak.png` | No streak yet: «۰» and «امروز شروعش کن», an empty grid |
| `mascots/` | The four mascot heads the mood picture uses, from the mobile app's `src/assets/moods/` |
| `boards/` | The two boards as the mobile app's canvas exported them. Each sample is a 432 by 768 `div`, the picture at 40 percent, so every size, colour and radius can be read from it |

The source of truth for the drawing is the mobile app's code: `src/kit/share-image-sheet/share-card.ts` (the shared card), `src/pages/mood/utils/render-mood-share-canvas.ts` with `mood-share-month.ts`, and `src/features/habits/utils/render-habit-share-canvas.ts`.

## The look

Both pictures are one family: 1080 by 1920 (9:16), the size of an Instagram story, drawn on a 432 by 768 layout scaled by 2.5.

- **Safe area:** Instagram covers about the top 250 and the bottom 340 of a story with its own bars. All the content sits in a 432 by 540 frame moved 96 down (240 to 1590 in the real picture), and only the background reaches the edges. In code that is one `translate(0, 96)` after the scale.

- **Background:** light, over the whole story. From the top: the accent colour at 50 percent, 10 percent at 296, `#F4F6FB` from 386 to 640, then back to the accent at 18 percent at the bottom edge (768). The accent is the month's most logged mood, or the habit's own colour.
- **Header:** the avatar (36, in a white circle) and the name, the square logo on the other side. A Pro account gets a 2.5 wide `#6366F1` ring around the avatar.
- **Hero:** three lines of text, and a sticker beside them: a white bordered card tilted −8°, a card in the accent colour tilted +12° behind it, a soft shadow in the accent, and the mascot head (mood) or the habit's emoji (habit) on top, tilted +8°. Around it only round shapes: white dots, a ring and dots in the accent. **Never stars or sparkles.**
- **Footer:** «ویجتیفای · widgetify.ir».

Mood picture: «حال من توی {ماه} {سال}», «بیشتر وقتا {خوبم}», «{n} روز از {m} روز ثبت شده»; then a white card with the weekday letters and the month from Saturday, each logged day a tile in its mood colour with the mascot head, missed days grey and days to come dashed; a six row month gets shorter tiles; under it a bar split by mood and the four counts.

Habit picture: «عادت من», the title and the goal; three tiles (streak with the 3D flame, best streak, done days); a white card with «۶ ماه اخیر», the 26 week grid from right to left in four strengths of the habit colour, and a «کمتر … بیشتر» key.

## Tasks

- [ ] Read this folder, the two boards and the mobile app's three files above. Branch from `main` (`feat/share-images-redesign`)
- [ ] Bring the four mascot heads into `src/assets/images/moods/` with the mood mapping the mobile app uses: excited → `mascot-excited`, happy → `mascot-happy`, normal and tired → `mascot-sleep`, sad → `mascot-tired`
- [ ] Mood colours: the mobile app uses the mood tokens (sad `255 98 125`, normal `252 183 0`, happy `124 141 240`, excited `0 211 144`). Check which extension tokens match; happy has no match in `design/README.md`, so ask the owner before adding one
- [ ] Put the shared parts (background, header with the Pro ring, sticker, white card, footer, fonts and Persian digits) in one module both renderers use, like `share-card.ts`
- [ ] Redraw `render-mood-share-canvas.ts`: accent from the most logged mood (a tie goes to the happier one, `tired` counts as `normal`), the hero, the month grid on the real weekday of day 1, six row months, the split bar and the counts. Remove the dark look, the badge, the insight text, the month watermark and the emoji avatar
- [ ] Redraw `render-habit-share-canvas.ts` at 1080 by 1920 (it is 540 by 960 at 2x today, the same shape): the sticker with the emoji, the three tiles with `best` added to the share data, the grid and the key. Remove the purple palette, the drawn flame and the chip
- [ ] Pass `pro` from the user's profile into both modals and renderers
- [ ] Move the logic (most logged mood with ties, weekday of day 1, rows, elapsed days of the current month, best streak) into dependency free files with `bun test` files beside them
- [ ] Copy through `t()`, following `.agents/TYPOGRAPHY.md`; delete the keys the old pictures used. Use the mobile app's words: «حال من توی …», «بیشتر وقتا …», «روز پشت‌سرهم», «بهترین رکورد», «روزهای موفق», «امروز شروعش کن», «۶ ماه اخیر», «کمتر», «بیشتر»
- [ ] Check the modals still fit: the mood picture changes from 4:5 (1080 by 1350 today) to 9:16, so the mood modal's preview and its 60vh cap change; the habit picture stays 9:16
- [ ] Analytics: keep `mood_share_month_changed`; add share and save events if the modals have none
- [ ] Rewrite the two widget READMEs (the habit one still says 9:16 and "exactly like the mobile app")
- [ ] Verify (AGENTS.md section 5) and compare the output side by side with `reference/` in the web clone

## Open questions for the owner

- The extension's `design/README.md` bans gradients, coloured shadows and emoji on chrome. These pictures are artwork a person shares, not chrome, so they keep the mobile look. Confirm that.
- A habit with no emoji: the mobile app puts 🎯 in the sticker, and no board shows it yet.
- A near-white habit colour (`#dedde3`) gives an almost invisible tint and grid in both apps. No fallback is drawn yet.
