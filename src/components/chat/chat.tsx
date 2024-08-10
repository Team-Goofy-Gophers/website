import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { api } from "~/utils/api"; // Adjust the import according to your project structure

export default function Chat({ disasterId }: { disasterId: string }) {
  const [messages, setMessages] = useState<
    { id: string; message: string; sender: string; senderId: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch initial messages
  const { data: initialMessages } = api.chat.getMessages.useQuery({
    disasterId,
  });

  useEffect(() => {
    if (initialMessages) {
      setMessages(
        initialMessages.map((it) => {
          return {
            id: it.id,
            message: it.message,
            sender: it.User.name ?? "User",
            senderId: it.User.id,
          };
        }),
      );
    }
  }, [initialMessages]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${disasterId}`);
    channel.bind(
      "message-event",
      (data: {
        id: string;
        message: string;
        sender: string;
        senderId: string;
      }) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      },
    );

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [disasterId]);

  const sendMessage = api.chat.send.useMutation();

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage.mutate({ message: newMessage, disasterId });
    setNewMessage("");
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}
