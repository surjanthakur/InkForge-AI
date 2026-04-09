import { useState, useEffect, useRef } from "react";
import { X, User, Bot, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { UseAiHook } from "../../hooks/useAI";
import { toast } from "react-hot-toast";
import { Loader } from "../../components/index";
import MarkdownRenderer from "./MarkdownRenderer";

import "../css/chatwindow.css";

export default function ChatWindow({ isOpen, onClose, post_data }) {
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

  const onSubmit = async (data) => {
    const req_ai_data = {
      title: post_data?.title,
      post_type: post_data?.post_type,
      context: post_data?.content,
      user_query: data?.message,
    };
    setMessages((prev) => [
      ...prev,
      { id: new Date().getTime(), role: "user", content: data.message },
    ]);

    reset();

    const res = await fetchAIResponse(req_ai_data);
    if (!res.ok) {
      toast.error(res?.error_msg);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: new Date().getTime(), role: "ai", content: res?.data?.content },
    ]);
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
            <h2 className="popup-title">your writer buddy</h2>
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
                key={message.id}
                className={`message-wrapper ${
                  message.role === "ai" ? "ai-message" : "user-message"
                }`}
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
                    {message.role === "ai" ? "writer buddy" : "You"}
                  </span>
                  <MarkdownRenderer content={message.content} />
                </div>
              </div>
            ))}
            {/* Show loader while waiting for AI response */}
            {isLoader && (
              <div className="message-wrapper ai-message">
                <div className="message-avatar">
                  <Bot size={18} />
                </div>
                <div className="message-content">
                  <span className="message-sender">wait im thinking🤔...</span>
                  <div className="message-text">
                    <Loader />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="input-form">
            <div className="input-wrapper">
              <input
                type="text"
                autoComplete="off"
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
