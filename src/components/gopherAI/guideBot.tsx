import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Bot } from "lucide-react";
import { useState } from "react";
import { RiRobotFill } from "react-icons/ri";
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

export default function GuideBot() {
  const [phase, setPhase] = useState("before");
  const [disaster, setDisaster] = useState("");
  const [language, setLanguage] = useState("english");
  const [response, setResponse] = useState<
    {
      action: string;
      description: string;
      importance: string;
      phase: string;
    }[]
  >([]);

  const guide = api.gemini.guide.useMutation();

  return (
    <Drawer>
      <DrawerTrigger>
        <span className="fixed bottom-5 right-5 rounded-full bg-primary p-4 text-white duration-300 hover:scale-105 hover:bg-primary/80">
          <Bot className="size-8" />
        </span>
      </DrawerTrigger>
      <DrawerContent className="!h-[80svh]">
        <DrawerHeader>
          <DrawerTitle>
            Hi! I&apos;m <strong>GopherAI</strong>
          </DrawerTitle>
          <DrawerDescription>
            I can help you decide what to do before, during and after any
            disaster!
          </DrawerDescription>
        </DrawerHeader>

        <div className="h-[80%] overflow-x-clip overflow-y-scroll px-5">
          <div className="mx-auto flex w-full flex-wrap items-stretch justify-center gap-6 py-8 md:mx-10">
            {response.map((it, index) => (
              <div
                key={index}
                className="flex max-w-sm flex-col gap-2 rounded-lg bg-primary/50 p-4 duration-300 hover:scale-105"
              >
                <strong
                  className={cn(
                    it.importance === "High" ? "text-red-800" : "text-lime-200",
                  )}
                >
                  {it.importance}
                </strong>
                <strong>{it.action}</strong>
                <p>{it.description}</p>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter>
          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            <p>List all essential actions to take</p>
            <Select
              onValueChange={(value) => {
                setPhase(value);
              }}
              defaultValue="during"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Before</SelectItem>
                <SelectItem value="during">During</SelectItem>
                <SelectItem value="after">After</SelectItem>
              </SelectContent>
            </Select>
            <p>a</p>
            <Input
              placeholder="Enter disaster"
              value={disaster}
              onChange={(e) => {
                setDisaster(e.target.value);
              }}
              className="w-[180px]"
            />
            <p>in</p>
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
          </div>
          <Button
            onClick={async () => {
              await guide.mutateAsync(
                {
                  phase: phase,
                  disaster: disaster,
                  language: language,
                },
                {
                  onSuccess: (data) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    setResponse(data);
                  },
                },
              );
            }}
          >
            {guide.isPending ? <span className="loader"></span> : "Get Guide"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
