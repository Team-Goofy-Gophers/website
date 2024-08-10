import { useState } from "react";
import { text } from "stream/consumers";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { api } from "~/utils/api";

export default function Test() {
  const [history, setHistory] = useState<
    {
      role: "user" | "model";
      parts: { text: string }[];
    }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");

  const chat = api.gemini.chat.useMutation();
  return (
    <>
      {history.map((item, index) => (
        <div key={index}>
          {item.role === "user" ? "User: " : "Model: "}
          {item.parts.map((part, index) => (
            <div key={index}>{part.text}</div>
          ))}
        </div>
      ))}

      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type here"
      />
      <Button
        onClick={() => {
          chat.mutate(
            {
              text: newMessage,
              history: history,
              language: "hindi",
            },
            {
              onSuccess: (data) => {
                setHistory([
                  ...history,
                  { role: "model", parts: [{ text: data }] },
                  { role: "user", parts: [{ text: newMessage }] },
                ]);
                setNewMessage("");
              },
            },
          );
        }}
      >
        Send
      </Button>
    </>
  );
}
