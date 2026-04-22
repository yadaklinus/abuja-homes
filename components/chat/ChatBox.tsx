'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardBody, CardFooter, Input, Button, Avatar, ScrollShadow } from '@heroui/react'
import { Send, Image as ImageIcon, Smile, MoreVertical } from 'lucide-react'
import { pusherClient } from '@/lib/pusher'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    name: string
    profile?: {
      avatarUrl: string
    }
  }
}

export default function ChatBox({ conversationId, currentUserId }: { conversationId: string, currentUserId: string }) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Initial fetch
    fetch(`/api/messages?conversationId=${conversationId}`)
      .then(res => res.json())
      .then(setMessages)

    // Subscribe to Pusher
    const channel = pusherClient.subscribe(`chat-${conversationId}`)
    channel.bind('new-message', (data: Message) => {
      setMessages(prev => [...prev, data])
    })

    return () => {
      pusherClient.unsubscribe(`chat-${conversationId}`)
    }
  }, [conversationId])

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const content = inputValue
    setInputValue('')

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content })
      })
    } catch (err) {
       console.error("Failed to send message")
    }
  }

  return (
    <Card className="h-[600px] flex flex-col border-none shadow-2xl shadow-slate-200 rounded-[3rem] bg-white overflow-hidden">
      <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Avatar src="https://i.pravatar.cc/150?u=landlord" size="md" className="rounded-2xl border-2 border-emerald-500" />
            <div>
               <p className="font-black text-sm">Landlord Properties Ltd</p>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online
               </div>
            </div>
         </div>
         <Button isIconOnly variant="light" className="text-white opacity-50"><MoreVertical size={20} /></Button>
      </div>

      <ScrollShadow ref={scrollRef} className="flex-1 p-8 space-y-6 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-5 rounded-[1.8rem] text-sm font-medium shadow-sm leading-relaxed ${
                  isMe ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </ScrollShadow>

      <CardFooter className="p-6 bg-white border-t border-slate-100">
         <form onSubmit={handleSendMessage} className="w-full flex items-center gap-3">
            <Button isIconOnly variant="light" className="text-slate-400"><ImageIcon size={20} /></Button>
            <Input 
              placeholder="Type your message..." 
              value={inputValue}
              onValueChange={setInputValue}
              variant="flat"
              className="flex-1"
              classNames={{
                inputWrapper: "h-14 rounded-2xl bg-slate-50 border-none",
                input: "font-bold text-slate-700"
              }}
            />
            <Button 
               type="submit"
               isIconOnly 
               color="primary" 
               className="h-14 w-14 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-900/10 active:scale-95 transition-all"
            >
               <Send size={24} />
            </Button>
         </form>
      </CardFooter>
    </Card>
  )
}
