"use client";

import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      const botMessage = { type: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage = {
        type: "bot",
        text: `Cannot connect to AI: ${error.message}`,
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Chatbot</h2>

      <div style={{ border: "1px solid #ccc", height: 200, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.type === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

