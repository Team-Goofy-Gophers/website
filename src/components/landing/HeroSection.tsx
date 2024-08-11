import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "~/components/ui/drawer";
import {
  ResizablePanel,
  ResizablePanelGroup,
  type ResizablePanelRef,
} from "~/components/ui/resizable";

import Chat from "../chat/chat";
import { Button } from "../ui/button";
import MapComponent from "./mapComponent";

export default function HeroSection() {
  const mapRef = useRef<ResizablePanelRef>(null);
  const chatRef = useRef<ResizablePanelRef>(null);
  const chatDrawerRef = useRef<HTMLDivElement>(null);
  const [currDisasterId, setCurrDisasterId] = useState<string>("");

  const switchChat = (id: string) => {
    if (mapRef.current && chatRef.current) {
      if (mapRef.current.isCollapsed()) {
        mapRef.current.expand();
        chatRef.current.resize(0);
      } else {
        mapRef.current.collapse();
        chatRef.current.resize(100);
      }
    }
    setCurrDisasterId(id);
  };

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex w-screen flex-col pt-[12rem] md:flex-row md:items-center md:gap-2 md:px-20 md:pt-0"
      >
        <div className="flex h-screen w-screen flex-col justify-center gap-4 text-center md:hidden">
          <h1 className="text-4xl font-bold notranslate">Astero</h1>
          <div className="mx-8 pb-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>

          <div className="md:hidden">
            <Drawer>
              <MapComponent
                customChat={({ onClick }) => {
                  return (
                    <DrawerTrigger asChild>
                      <Button onClick={onClick}>Chat</Button>
                    </DrawerTrigger>
                  );
                }}
                onChatClick={(id) => {
                  setCurrDisasterId(id);
                }}
                className="h-[100svh] animate-scale overflow-hidden rounded-md border-2 border-border"
              />
              <DrawerContent ref={chatDrawerRef}>
                <Chat
                  className="h-full w-screen border border-none"
                  disasterId={currDisasterId}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <ResizablePanel
          ref={mapRef}
          collapsible={true}
          collapsedSize={0}
          defaultSize={50}
          className="hidden h-[100svh] w-1/2 flex-col justify-center gap-8 text-center md:flex"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="pl-6 text-left text-7xl font-bold"
          >
            Astero
            <h1 className="mt-2 text-xl font-normal">
              Be a saviour to the people around you
            </h1>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mx-8 text-2xl font-normal"
          >
            <div className="text-left text-xl">
              <h1 className="text-2xl font-bold">The features</h1>
              <ul className="list-disc pl-5">
                <li>Get to know the disasters around you.</li>
                <li>Report disasters at the earliest and earn points.</li>
                <li>Help people in need through proximity-chat and charity.</li>
                <li>Ask GopherAI for information and help.</li>
                <li>Read our Guides to be disaster-ready.</li>
                <li>A mulitlingual AI to answer your questions on the go.</li>
              </ul>
            </div>
          </motion.div>
        </ResizablePanel>
        <ResizablePanel collapsible={true}>
          <MapComponent
            onChatClick={switchChat}
            className="h-[85svh] animate-scale overflow-hidden rounded-md border-2 border-border"
          />
        </ResizablePanel>
        <ResizablePanel ref={chatRef} defaultSize={0} maxSize={30}>
          <Chat
            disasterId={currDisasterId}
            className="hidden h-[85svh] rounded-lg border-2 border-border bg-foreground/50 md:flex"
          />
          <X
            className="absolute right-1 top-1 stroke-primary/50"
            onClick={() => switchChat("")}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
