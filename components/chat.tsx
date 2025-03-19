'use client';

import { Markdown } from './markdown';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { sendNotification } from '@tauri-apps/plugin-notification';
import { SendIcon, LoaderCircle, CircleXIcon } from 'lucide-react';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Chat() {
  const [isComposing, setIsComposing] = useState(false);
  const { messages, input, setInput, handleInputChange, handleSubmit, status, error } = useChat({
    api: 'https://localhost:3001/api/chat'
  });

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive - fixed to only scroll the container
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Send notification when a new message arrives and the messages end ref is not in view
  useEffect(() => {
    if (status !== 'ready') return;
    const container = messagesContainerRef.current;
    if (container && messagesEndRef.current) {
      const isAtBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
      if (!isAtBottom) {
        // Notify user about new message
        sendNotification({ title: 'New message', body: 'Response received' });
      }
    }
  }, [messages, status]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (status === 'error') {
      toast.error('Error sending message');
      toast.error(error?.message || 'Unknown error');
    }
  }, [error?.message, status]);

  return (
    <div className="flex flex-col relative h-full w-full rounded-lg ">
      {/* Messages area */}
      <div ref={messagesContainerRef} className=" overflow-y-auto p-4 h-[60dvh]">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            <p>Send a message to start</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex mt-2', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'rounded-lg  flex py-2 text-sm max-w-[80%] items-start ',
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {message.role === 'assistant' && (
                  <Image
                    src="/logo.svg"
                    alt="Mono Mode"
                    width={20}
                    height={20}
                    className={cn(
                      'brightness-100 invert-0 dark:brightness-0 dark:invert',
                      status === 'streaming' && 'animate-spin ease-in-out duration-1000'
                    )}
                    priority
                  />
                )}
                <span className={cn('px-3', message.role === 'assistant' && 'px-2')}>
                  <Markdown>{message.content}</Markdown>
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 ">
        <form onSubmit={handleFormSubmit} className="flex gap-2 x">
          <div className="relative flex-1">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Say something..."
              className="field-sizing-content max-h-29.5  resize-none py-1.75 min-h-10 border-primary"
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isComposing && !e.shiftKey) {
                  handleFormSubmit(e);
                }
              }}
              ref={inputRef}
            />
            {input && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear input"
                onClick={() => {
                  setInput('');
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!(status === 'ready')}
            className="shrink-0 mt-auto"
          >
            {status === 'streaming' ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <SendIcon size={16} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
