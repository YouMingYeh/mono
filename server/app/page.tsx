'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { SendIcon, LoaderCircle, MapPin, CloudSun } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult, isLoading } = useChat({
    maxSteps: 5,
    api: 'http://localhost:3001/api/chat'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] rounded-lg border bg-card">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
        <span className="text-xs text-muted-foreground">{isLoading ? 'Thinking...' : 'Ready'}</span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            <p>Tell me anything...</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-2 transition-opacity',
                !mounted && 'opacity-0',
                mounted && 'opacity-100',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {message.parts.map((part, idx) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <p key={idx} className="whitespace-pre-wrap">
                          {part.text}
                        </p>
                      );

                    case 'tool-invocation': {
                      const callId = part.toolInvocation.toolCallId;

                      switch (part.toolInvocation.toolName) {
                        case 'askForConfirmation': {
                          switch (part.toolInvocation.state) {
                            case 'call':
                              return (
                                <div key={callId} className="space-y-2">
                                  <p>{part.toolInvocation.args.message}</p>
                                  <div className="flex gap-2 mt-1">
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() =>
                                        addToolResult({
                                          toolCallId: callId,
                                          result: 'Yes, confirmed.'
                                        })
                                      }
                                    >
                                      Yes
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        addToolResult({
                                          toolCallId: callId,
                                          result: 'No, denied'
                                        })
                                      }
                                    >
                                      No
                                    </Button>
                                  </div>
                                </div>
                              );
                            case 'result':
                              return (
                                <p key={callId} className="text-xs text-muted-foreground">
                                  Response: {part.toolInvocation.result}
                                </p>
                              );
                          }
                          break;
                        }

                        case 'getLocation': {
                          switch (part.toolInvocation.state) {
                            case 'call':
                              return (
                                <div
                                  key={callId}
                                  className="flex items-center gap-2 text-muted-foreground"
                                >
                                  <LoaderCircle size={14} className="animate-spin" />
                                  <span>Accessing location...</span>
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId} className="flex items-center gap-2">
                                  <MapPin size={14} />
                                  <span>{part.toolInvocation.result}</span>
                                </div>
                              );
                          }
                          break;
                        }

                        case 'getWeatherInformation': {
                          switch (part.toolInvocation.state) {
                            case 'partial-call':
                              return (
                                <div
                                  key={callId}
                                  className="flex items-center gap-2 text-muted-foreground"
                                >
                                  <LoaderCircle size={14} className="animate-spin" />
                                  <span>Getting weather data...</span>
                                </div>
                              );
                            case 'call':
                              return (
                                <div
                                  key={callId}
                                  className="flex items-center gap-2 text-muted-foreground"
                                >
                                  <LoaderCircle size={14} className="animate-spin" />
                                  <span>Weather for {part.toolInvocation.args.city}...</span>
                                </div>
                              );
                            case 'result':
                              return (
                                <div key={callId} className="flex items-center gap-2">
                                  <CloudSun size={14} />
                                  <span>{part.toolInvocation.result}</span>
                                </div>
                              );
                          }
                          break;
                        }
                        default:
                          return null;
                      }
                    }
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <form onSubmit={handleFormSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <SendIcon size={18} />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
