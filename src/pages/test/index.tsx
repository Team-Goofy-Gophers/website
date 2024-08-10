import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

export default function Test() {
  const [history, setHistory] = useState<
    {
      role: "user" | "model";
      parts: { text: string }[];
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [language, setLanguage] = useState("english");

  const chat = api.gemini.chat.useMutation();
  return (
    <>
      <div className="container flex flex-col gap-2">
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
                  : "bg-orange-300 text-black",
                "w-[50%] rounded-lg p-2",
              )}
            >
              <strong>{item.role === "user" ? "User" : "Mitra"}</strong>
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
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
