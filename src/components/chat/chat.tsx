import Pusher from "pusher-js";
import React, { useEffect, useRef, useState } from "react";

import { api } from "~/utils/api";

import { Button } from "../ui/button";
// Adjust the import according to your project structure
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

export default function Chat({
  disasterId,
  className,
}: {
  disasterId: string;
  className?: string;
}) {
  const [messages, setMessages] = useState<
    { id: string; message: string; sender: string; senderId: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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
    //TODO: Nandan - Add Pusher key and cluster to env.js
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = api.chat.send.useMutation();

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage.mutate({ message: newMessage, disasterId });
    setNewMessage("");
  };

  return (
    <Card className="relative h-[calc(100svh-6rem)] min-w-[25rem]">
      <CardHeader className="z-10 w-full bg-background">
        <CardTitle>{disasterId}</CardTitle>
      </CardHeader>
      <ScrollArea className="z-0 mb-10 h-[85%]" ref={scrollRef}>
        <CardContent>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="my-2 flex max-w-[75%] flex-col gap-1 rounded-lg bg-slate-800 p-2"
            >
              <strong>{msg.sender}</strong>
              <p className="font-thin">{msg.message}</p>
            </div>
          ))}
        </CardContent>
      </ScrollArea>

      <CardFooter className="absolute bottom-0 flex w-full items-center justify-center gap-1 bg-background">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className="w-full"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </CardFooter>
    </Card>
  );
}
