import { X } from "lucide-react";
import { FunctionComponent, useEffect, useRef, useState } from "react";

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
  ResizablePanel,
  ResizablePanelGroup,
  ResizablePanelRef,
} from "~/components/ui/resizable";

import Chat from "../chat/chat";
import { Button } from "../ui/button";
import MapComponent from "./mapComponent";

export default function HeroSection() {
  const mapRef = useRef<ResizablePanelRef>(null);
  const chatRef = useRef<ResizablePanelRef>(null);
  const chatDrawerRef = useRef<HTMLDivElement>(null);
  const [currDisasterId, setCurrDisasterId] = useState<string>("");

  useEffect(() => {
    chatRef.current?.collapse();
  });

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-fit w-screen flex-col md:min-h-[calc(100vh-5rem)] md:flex-row md:items-center md:gap-2 md:px-20"
      >
        <div className="flex h-fit w-screen flex-col justify-center gap-4 text-center md:hidden">
          <h1 className="text-4xl font-bold">Goofy Goofers</h1>
          <div className="mx-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>

          <div
            onClick={(e) => e.currentTarget.scrollIntoView()}
            className="mt-20 h-[calc(100vh-1rem)] pt-2 md:hidden"
          >
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
                className="h-[calc(100vh-1rem)] animate-scale overflow-hidden rounded-md border-2 border-border"
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
          className="hidden w-1/2 flex-col justify-center gap-4 text-center md:flex"
        >
          <h1 className="text-4xl font-bold">Goofy Goofers</h1>
          <div className="mx-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>
        </ResizablePanel>
        <ResizablePanel collapsible={true} className="md:h-[100svh]">
          <MapComponent
            onChatClick={(id: string) => {
              mapRef.current?.collapse();
              chatRef.current?.expand();
              setCurrDisasterId(id);
            }}
            className="h-[calc(100vh-6rem)] animate-scale overflow-hidden rounded-md border-2 border-border"
          />
        </ResizablePanel>
        <ResizablePanel
          ref={chatRef}
          collapsible={true}
          defaultSize={30}
          className="relative"
        >
          <Chat
            disasterId={currDisasterId}
            className="min-h-[calc(100vh-6rem)] rounded-lg border-2 border-border bg-foreground/50"
          />
          <X
            className="absolute right-1 top-1 stroke-primary/50"
            onClick={() => {
              mapRef.current?.expand();
              chatRef.current?.collapse();
              setCurrDisasterId("");
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
