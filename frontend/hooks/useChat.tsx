import { useEffect, useRef, useState } from "react";
import { IChatMessage } from "../types";

export const useChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<IChatMessage[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat?prompt=${encodeURIComponent(
        message
      )}`
    );

    setChat((prev) => [
      ...prev,
      { sender: "user", text: message },
      { sender: "bot", text: "" },
    ]);

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

  return { message, setMessage, chat, sendMessage };
};
