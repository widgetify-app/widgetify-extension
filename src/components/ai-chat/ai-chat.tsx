import { useState } from 'react'
import { FiMessageSquare, FiX } from 'react-icons/fi'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('https://text.pollinations.ai/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai',
          messages: [...messages, userMessage],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = { role: 'assistant', content: data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.' }
        setMessages(prev => [...prev, aiMessage])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not get response from AI.' }])
      }
    } catch (error) {
      console.error('AI Chat Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Network issue.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-20 right-6 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-900 dark:text-white">باباهوشو</h3>
      </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-64">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center">گفتگو با باباهوشو را شروع کنید!</p>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900 ml-8'
                    : 'bg-gray-100 dark:bg-gray-700 mr-8'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 dark:bg-gray-700 mr-8 p-3 rounded-lg">
                <p className="text-sm text-gray-500">باباهوشو در حال تایپ است...</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="پیام خود را تایپ کنید..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                ارسال
              </button>
            </div>
          </div>
        </div>
  )
}