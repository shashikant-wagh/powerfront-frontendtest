import React from "react";
import { useRef, useState, useEffect } from "react";

import chat from "./assets/js/chat.js";

// Formate date time in readable format
const formatDateTime = (datetime) => {
  const date = new Date(datetime);

  return (
    date.toDateString() +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  );
};

function App() {
  // State for the input message
  const [message, setMessage] = useState("");
  // State for storing chat history
  const [chatHistory, setChatHistory] = useState([]);
  // Reference for the end of messages to scroll to
  const messagesEndRef = useRef(null);

  // Effect to fetch initial chat history on component mount
  useEffect(() => {
    chat.getChatHistory(setChatHistory);
  }, []);

  // Effect to add listener for incoming chat messages
  useEffect(() => {
    chat.addListener("chatreceived", function (data) {
      setChatHistory((prev) => [...prev, data.chat]);
    });

    // Clean-up function to remove listener on component unmount
    return () => {
      chat.removeListener("chatreceived");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Function to scroll to bottom of chat messages
  const scrollToBottom = () => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    chat.sendChat(message);
    setMessage("");
  };

  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      {/* Header section */}
      <div className="flex sm:items-center justify-between p-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="text-gray-700 mr-3">React Chat</span>
            </div>
          </div>
        </div>
      </div>
      {/* Chat messages section */}
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {/* Mapping over chat history to render messages */}
        {chatHistory.map((chat, index) => {
          const positionClass =
            chat.from.toLowerCase() === "visitor" ? "justify-end" : "";

          const colorClass =
            chat.from.toLowerCase() === "visitor"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-600";

          const chatContinues =
            chat.from.toLowerCase() ===
            chatHistory[index + 1]?.from?.toLowerCase();

          const shapeClass = chatContinues
            ? ""
            : chat.from.toLowerCase() === "visitor"
            ? "rounded-br-none"
            : "rounded-bl-none";

          return (
            <div key={index} className="chat-message">
              <div className={`flex items-end ${positionClass}`}>
                <div className="flex flex-col space-y-2 max-w-xs mx-2 order-2 items-start">
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg inline-block ${shapeClass} ${colorClass}`}
                    >
                      {chat.message}
                    </span>
                  </div>
                </div>
              </div>

              {chatContinues ? null : (
                <div
                  className={`flex items-end  text-xs text-right mt-2 ${positionClass}`}
                >
                  {formatDateTime(chat.datetime)}
                </div>
              )}
            </div>
          );
        })}
        {/* Reference element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        {/* Form for sending messages */}
        <form className="relative flex" onSubmit={onSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-6 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 ">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 ml-2 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
