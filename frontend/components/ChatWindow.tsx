"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChat } from "../hooks/useChat";

export const ChatWindow = () => {
  const { message, setMessage, chat, sendMessage } = useChat();
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = endRef.current;
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chat]);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 space-y-4 shadow-lg bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        ZabikGPT
      </h1>

      <div className="border border-gray-300 p-4 h-96 overflow-auto whitespace-pre-wrap bg-gray-50">
        <div className="flex flex-col gap-2">
          {chat.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <ChatInput
        message={message}
        setMessage={setMessage}
        onSend={sendMessage}
      />
    </div>
  );
};
