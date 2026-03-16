import React, { useState, useEffect, useRef } from "react";
import { X, User, Bot, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import "../css/chatwindow.css";

export default function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, type: "ai", text: "Hello! How can I help you today?" },
    { id: 2, type: "user", text: "I have a question about your services." },
    {
      id: 3,
      type: "ai",
      text: "Of course! I'd be happy to help. What would you like to know?",
    },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const onSubmit = (data) => {
    if (data.message.trim()) {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "user",
          text: data.message,
        },
      ]);

      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai",
            text: "Thanks for your message! Our team will get back to you shortly.",
          },
        ]);
      }, 1000);

      reset();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">Chat Assistant</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.type === "ai" ? "ai-message" : "user-message"}`}
            >
              <div className="message-avatar">
                {message.type === "ai" ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className="message-content">
                <span className="message-sender">
                  {message.type === "ai" ? "AI Assistant" : "You"}
                </span>
                <p className="message-text">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="input-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Type your message..."
              className="message-input"
              {...register("message", {
                required: "Message cannot be empty",
                validate: (value) =>
                  value.trim().length > 0 || "Please enter a valid message",
              })}
              ref={inputRef}
            />
            <button
              type="submit"
              className="send-button"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          {errors.message && (
            <span className="error-message">{errors.message.message}</span>
          )}
        </form>
      </div>
    </div>
  );
}
