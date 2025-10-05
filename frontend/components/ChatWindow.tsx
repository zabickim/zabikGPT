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
    <div className="max-w-2xl mx-auto mt-10 p-4 space-y-4 shadow-lg bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        ZabikGPT
      </h1>

      <div className="border border-gray-300 p-4 h-64 overflow-auto whitespace-pre-wrap bg-gray-50">
        {chat || (
          <span className="text-gray-400">
            Twoja rozmowa pojawi się tutaj...
          </span>
        )}
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
