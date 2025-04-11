import React, { useState } from "react";

import { Drawer } from "vaul";

import { MessageSquare } from "lucide-react";
/* Dummy Messages */
interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isOwnMessage: boolean; // Differentiating sender & own message
}

/* Sample Messages */
const messages: Message[] = [
  {
    id: 1,
    sender: "Alice",
    text: "Hey, how's work?",
    time: "10:05 AM",
    isOwnMessage: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Going well, thanks!",
    time: "10:07 AM",
    isOwnMessage: true,
  },
  {
    id: 3,
    sender: "Alice",
    text: "Let’s catch up later.",
    time: "10:10 AM",
    isOwnMessage: false,
  },
  {
    id: 4,
    sender: "You",
    text: "Sure! Let me know when.",
    time: "10:12 AM",
    isOwnMessage: true,
  },
];

export default function MessagesPanel() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");

  const handleSendMessage = () => {
    if (reply.trim() === "") return;
    console.log("Message Sent:", reply);
    setReply(""); // Clear input after sending
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <div className="relative">
          {" "}
          <MessageSquare className="h-8 " />
          <span className="absolute top-[-2] right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Title className="font-medium mb-2 text-zinc-900">
          you meassges sir
        </Drawer.Title>
        <Drawer.Content className="bg-white h-[80vh] fixed  top-16 bottom-0  right-0 outline-none p-4 rounded-t-lg w-[40vw]">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Messages</h2>
            <button
              onClick={() => setSelectedChat(null)}
              className="text-blue-500"
            >
              Back
            </button>
          </div>

          {/* Chat Selection */}
          {!selectedChat ? (
            <div className="mt-3 space-y-2">
              <button
                onClick={() => setSelectedChat("Alice")}
                className="block w-full text-left p-2 bg-gray-100 rounded-md"
              >
                Chat with Alice
              </button>
              <button
                onClick={() => setSelectedChat("Bob")}
                className="block w-full text-left p-2 bg-gray-100 rounded-md"
              >
                Chat with Bob
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-col h-[calc(100%-100px)]">
              {/* Messages List */}
              <div className="flex-1 space-y-3 overflow-y-auto p-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg ${
                      msg.isOwnMessage
                        ? "bg-blue-100 self-end text-right"
                        : "bg-gray-100"
                    }`}
                  >
                    <h4 className="text-sm font-semibold">{msg.sender}</h4>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs text-sms">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-md"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
