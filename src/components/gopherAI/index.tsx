import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function GopherAI() {
  const [history, setHistory] = useState<
    {
      role: "user" | "model";
      parts: { text: string }[];
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [language, setLanguage] = useState("english");
  const scrollRef = useRef<HTMLDivElement>(null);

  const chat = api.gemini.chat.useMutation();

  useEffect(() => {
    if (scrollRef.current) {
      const child = scrollRef.current.childNodes;
      const lastChild = child[child.length - 1] as HTMLElement;
      lastChild.scrollBy({
        top: lastChild.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  return (
    <Drawer>
      <DrawerTrigger>
        <span className="fixed bottom-5 left-5 rounded-full bg-primary p-4 text-white duration-300 hover:scale-105 hover:bg-primary/80">
          <ChatBubbleIcon className="size-8" />
        </span>
      </DrawerTrigger>
      <DrawerContent className="!h-[80svh]">
        <DrawerHeader>
          <DrawerTitle>
            Hi! I&apos;m <strong>GopherAI</strong>
          </DrawerTitle>
          <DrawerDescription>Ask gopher anything!</DrawerDescription>
        </DrawerHeader>

        <div className="h-[80%] overflow-y-scroll px-5" ref={scrollRef}>
          {history.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex w-full",
                item.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  item.role === "user"
                    ? "bg-gray-800 text-white"
                    : "bg-primary/40 text-black",
                  "min-w-[25%] max-w-[50%] rounded-lg p-2",
                )}
              >
                <strong>{item.role === "user" ? "User" : "Gopher"}</strong>
                {item.parts.map((part, index) => (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    key={index}
                    className={"font-thin"}
                  >
                    {part.text}
                  </Markdown>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DrawerFooter>
          <div className="flex w-full items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type here"
            />
            <Select
              onValueChange={(value) => {
                setLanguage(value);
              }}
              defaultValue="english"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">Hindi</SelectItem>
                <SelectItem value="kannada">Kannada</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                chat.mutate(
                  {
                    text: newMessage,
                    history: history,
                    language: language,
                  },
                  {
                    onSuccess: (data) => {
                      setHistory([
                        ...history,
                        { role: "user", parts: [{ text: newMessage }] },
                        { role: "model", parts: [{ text: data }] },
                      ]);
                      setNewMessage("");
                    },
                  },
                );
              }}
              disabled={newMessage === "" && chat.isPending}
            >
              {chat.isPending ? <span className="loader"></span> : "Send"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
