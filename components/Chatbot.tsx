
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import type { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import Spinner from './Spinner';

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: "Merhaba! Ben Sparkle ✨. Bugün benim için hangi harika sorun var?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const botResponseText = await sendChatMessage(input);
            const botMessage: ChatMessage = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (err: any) {
            setError(err.message || 'Bir şeyler ters gitti.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-slate-200 flex flex-col h-[70vh] max-h-[700px]">
            <div className="p-4 border-b border-slate-200">
                <h2 className="text-2xl font-bold font-display text-slate-700 text-center">Sparkle'a Sor!</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-slate-200 text-slate-800 rounded-bl-lg'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-lg flex items-center space-x-2">
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-75"></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></div>
                           <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>
                )}
                 {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Sorunu yaz..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-blue-600 text-white font-bold w-10 h-10 rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center justify-center" disabled={isLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;