"use client";

import { useEffect, useRef, useState } from "react";

export const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

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

    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.done) {
          eventSource.close();
          eventSourceRef.current = null;
          return;
        }

        if (data.error) {
          setChat((prev) => prev + `\n Error: ${data.error}`);
          eventSource.close();
          eventSourceRef.current = null;
          return;
        }

        if (data.data) {
          setChat((prev) => prev + data.data);
        }
      } catch {
        setChat((prev) => prev + e.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current = eventSource;

    setMessage("");
  };

  useEffect(() => {
    const currentEventSource = eventSourceRef.current;

    return () => {
      if (currentEventSource) {
        currentEventSource.close();
      }
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-2">
      <h1 className="text-2xl font-bold text-center">ZabikGPT</h1>
      <div className="border p-4 h-64 overflow-auto whitespace-pre-wrap bg-gray-50">
        {chat}
      </div>

      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Napisz wiadomość..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button
        className="bg-gray-500 text-white p-2 w-full"
        onClick={handleSend}
      >
        Wyślij
      </button>
    </div>
  );
};
