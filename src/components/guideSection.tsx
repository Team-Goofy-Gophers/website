import { Guide } from "@prisma/client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Drawer,
  DrawerClose,
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

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Input } from "./ui/input";

const GuideSection = () => {
  const { data: guides } = api.guides.getAllGuides.useQuery();
  const [currentGuide, setCurrentGuide] = useState<Guide | null>(null);
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
      <div className="my-auto flex h-[90svh] w-full gap-4 pt-[10svh]">
        <Card className="flex h-full w-1/3 flex-col gap-4 overflow-y-auto p-6">
          <h1 className="text-center text-2xl font-bold">Guides</h1>
          {guides?.map((g, index) => (
            <Card key={index} onClick={() => setCurrentGuide(g)}>
              <CardHeader>{g.title}</CardHeader>
              <CardContent>
                <Image
                  src={
                    g.images[0]
                      ? g.images[0]
                      : "/images/profile-placeholder.png"
                  }
                  alt={g.title}
                  width={300}
                  height={300}
                  className="aspect-video h-48 w-full rounded-lg object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </Card>

        <Card className="h-full w-2/3 overflow-y-scroll">
          <CardContent className="flex flex-col items-start justify-center gap-4 p-6">
            {currentGuide ? (
              <>
                <h1 className="text-3xl font-bold">{currentGuide?.title}</h1>
                <Carousel className="w-full">
                  <CarouselContent>
                    {currentGuide?.images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-1/2 lg:basis-1/3"
                      >
                        <Image
                          src={image}
                          alt={currentGuide.title}
                          width={300}
                          height={300}
                          className="aspect-video h-48 w-full rounded-lg border object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselNext />
                  <CarouselPrevious />
                </Carousel>

                <p
                  dangerouslySetInnerHTML={{ __html: currentGuide?.data ?? "" }}
                ></p>
              </>
            ) : (
              <h1 className="flex h-full w-full flex-col !items-center justify-center text-3xl font-bold">
                Select a guide
              </h1>
            )}
          </CardContent>
        </Card>
      </div>

      <Drawer>
        <DrawerTrigger>
          <span className="absolute bottom-5 right-5 rounded-full bg-primary p-4 text-white duration-300 hover:scale-105 hover:bg-primary/80">
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

          <div className="h-[80%] overflow-y-scroll px-5">
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
                    "min-w-[25%] max-w-[50%] rounded-lg p-2",
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
                {chat.isPending ? <span>...</span> : "Send"}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default GuideSection;
