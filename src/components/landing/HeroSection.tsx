import { useEffect, useRef, useState } from "react";
import Chat from "../chat/chat";
import MapComponent from "./mapComponent";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizablePanelRef,
} from "~/components/ui/resizable";
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
import { X } from "lucide-react";
import { Button } from "../ui/button";

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
        className="flex h-fit w-screen flex-col md:min-h-[calc(100vh-5rem)] md:flex-row md:items-center md:gap-2 md:px-2"
      >
        <div className="flex h-fit w-screen flex-col justify-center gap-4 bg-card py-20 text-center md:hidden">
          <h1 className="text-4xl font-bold">Goofy Goofers</h1>
          <div className="mx-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>

          <div
            onClick={(e) => e.currentTarget.scrollIntoView()}
            className="mt-20 h-[calc(100vh-1rem)] pt-2 md:hidden"
          >
            <MapComponent
              customChat={
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button>Chat</Button>
                  </DrawerTrigger>
                  <DrawerContent ref={chatDrawerRef}>
                    <Chat
                      className="h-full w-screen border border-none"
                      disasterId={currDisasterId}
                    />
                  </DrawerContent>
                </Drawer>
              }
              onChatClick={() => {}}
              className="animate-scale h-[calc(100vh-1rem)] overflow-hidden rounded-md border-2 border-border"
            />
          </div>
        </div>

        <ResizablePanel
          ref={mapRef}
          collapsible={true}
          collapsedSize={0}
          defaultSize={50}
          className="hidden w-1/2 flex-col justify-center gap-4 bg-card text-center md:flex"
        >
          <h1 className="text-4xl font-bold">Goofy Goofers</h1>
          <div className="mx-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>
        </ResizablePanel>
        <ResizablePanel collapsible={true} className="md:h-[calc(100vh-6rem)]">
          <MapComponent
            onChatClick={(id: string) => {
              mapRef.current?.collapse();
              chatRef.current?.expand();
              setCurrDisasterId(id);
            }}
            className="animate-scale h-[calc(100vh-6rem)] overflow-hidden rounded-md border-2 border-border"
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
