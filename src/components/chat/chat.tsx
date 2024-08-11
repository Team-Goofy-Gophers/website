import { format } from "date-fns";
import Pusher from "pusher-js";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";
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
    {
      id: string;
      message: string;
      sender: string;
      senderId: string;
      time: Date;
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: disasterAlert } = api.disaster.getDisasterAlert.useQuery({
    id: disasterId,
  });

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
            time: it.createdAt,
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
        time: Date;
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
      const child = scrollRef.current.childNodes;
      const lastChild = child[child.length - 1] as HTMLElement;
      lastChild.scrollBy({
        top: lastChild.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = api.chat.send.useMutation();

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage.mutate({ message: newMessage, disasterId });
    setNewMessage("");
  };

  return (
    <Card className={cn("relative max-h-[calc(100vh-5rem)]")}>
      <CardHeader className="z-10 w-full bg-background">
        <CardTitle>
          {disasterAlert ? disasterAlert.Disaster.name : "Something went wrong"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="z-0 mb-10 h-[calc(100vh-17rem)]" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="my-2 flex max-w-[75%] flex-col gap-1 rounded-lg border-2 border-primary/90 bg-primary/80 p-2 text-white"
            >
              <strong>{msg.sender}</strong>
              <p className="font-normal">{msg.message}</p>
              <span className="self-end text-xs font-extralight">
                {format(
                  msg.time instanceof Date ? msg.time : new Date(),
                  "HH:mm",
                )}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>

      <CardFooter className="absolute bottom-0 flex w-full items-center justify-center gap-1 bg-background">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your message..."
          className=""
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </CardFooter>
    </Card>
  );
}
