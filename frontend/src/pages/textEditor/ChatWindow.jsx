import { useState, useEffect, useRef } from "react";
import { X, User, Bot, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { UseAiHook } from "../../hooks/useAI";
import { toast } from "react-hot-toast";

import "../css/chatwindow.css";

export default function ChatWindow({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const { fetchAIResponse, isLoader } = UseAiHook();

  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // handle submit
  const onSubmit = async (data) => {
    setMessages((prev) => [...prev, { role: "user", content: data.message }]);

    reset();

    const res = await fetchAIResponse(data.message);
    if (!res.ok) {
      toast.error(res.detail);
      return;
    }
    setMessages((prev) => [...prev, { role: "ai", content: res.content }]);
  };

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <h2 className="popup-title">Chat Assistant</h2>
            <button
              className="close-button"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.role}
                className={`message-wrapper ${message.role === "ai" ? "ai-message" : "user-message"}`}
              >
                <div className="message-avatar">
                  {message.role === "ai" ? (
                    <Bot size={18} />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className="message-content">
                  <span className="message-sender">
                    {message.role === "ai" ? "AI Assistant" : "You"}
                  </span>
                  <p className="message-text">{message.content}</p>
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
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className="send-button"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
