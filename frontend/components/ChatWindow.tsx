"use client";

import { useEffect, useRef, useState } from "react";
import { IChatMessage } from "../types";
import { ChatMessage } from "./ChatMessage";

export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<IChatMessage[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentEventSource = eventSourceRef.current;

    return () => {
      if (currentEventSource) {
        currentEventSource.close();
      }
    };
  }, []);

  useEffect(() => {
    const node = endRef.current;
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chat]);

  const handleSend = () => {
    if (!message.trim()) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat?prompt=${encodeURIComponent(
        message
      )}`
    );

    setChat((prev) => {
      const newChat = [
        ...prev,
        { sender: "user", text: message } as IChatMessage,
        { sender: "bot", text: "" } as IChatMessage,
      ];
      return newChat;
    });

    const chatMessageIndex = chat.length + 1;

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.done) {
          eventSource.close();
          eventSourceRef.current = null;
          return;
        }

        if (data.error) {
          setChat((prev) =>
            prev.map((msg, i) =>
              i === chatMessageIndex
                ? { ...msg, text: `Error: ${data.error}` }
                : msg
            )
          );
          eventSource.close();
          eventSourceRef.current = null;
          return;
        }

        if (data.data) {
          setChat((prev) =>
            prev.map((msg, i) =>
              i === chatMessageIndex
                ? { ...msg, text: msg.text + data.data }
                : msg
            )
          );
        }
      } catch {
        setChat((prev) =>
          prev.map((msg, i) =>
            i === chatMessageIndex ? { ...msg, text: e.data } : msg
          )
        );
      }
    };

    eventSource.onerror = () => {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Błąd połączenia z API." },
      ]);

      eventSource.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current = eventSource;

    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 space-y-4 shadow-lg bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        ZabikGPT
      </h1>

      <div
        ref={containerRef}
        className="border border-gray-300 p-4 h-96 overflow-auto whitespace-pre-wrap bg-gray-50"
      >
        <div className="flex flex-col gap-2">
          {chat.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="border border-gray-300 p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Napisz wiadomość..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 rounded-md transition"
          onClick={handleSend}
        >
          Wyślij
        </button>
      </div>
    </div>
  );
};
