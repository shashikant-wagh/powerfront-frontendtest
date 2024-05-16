import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatApp from "../src/ChatApp.jsx";
import chat from "../src/assets/js/chat.js";

// Mock the chat module
jest.mock("../src/assets/js/chat.js", () => {
  return {
    __esModule: true,
    default: {
      sendChat: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      getChatHistory: jest.fn(),
    },
  };
});

describe("ChatApp", () => {
  test("renders send button", () => {
    render(<ChatApp />);
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("sends and receives messages correctly", async () => {
    const { getByPlaceholderText, getByText } = render(<ChatApp />);

    // Type a message and submit
    const messageInput = getByPlaceholderText("Write your message!");
    fireEvent.change(messageInput, {
      target: { value: "Hello, can you help me?" },
    });

    const sendButton = getByText("Send");
    fireEvent.click(sendButton);

    // Expect the chat module's sendChat function to be called
    expect(chat.sendChat).toHaveBeenCalledWith("Hello, can you help me?");
  });
});
