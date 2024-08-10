import { useEffect, useRef } from "react";
import Chat from "../chat/chat";
import { Button } from "../ui/button";
import MapComponent from "./mapComponent";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizablePanelRef,
} from "~/components/ui/resizable";
import { X } from "lucide-react";

export default function HeroSection() {
  const mapRef = useRef<ResizablePanelRef>(null);
  const chatRef = useRef<ResizablePanelRef>(null);

  useEffect(() => {
    chatRef.current?.collapse();
  });
  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex h-fit w-screen flex-col border-2 p-2 px-10 md:h-[calc(100vh-5rem)] md:flex-row md:gap-2"
      >
        <div className="flex h-fit w-screen flex-col justify-center gap-4 bg-card py-20 text-center md:hidden">
          <h1 className="text-4xl font-bold">Goofy Goofers</h1>
          <div className="mx-8 text-xl font-normal">
            <h2>Get to know the disasters around you.</h2>
            <h2>Help people in need through chat.</h2>
          </div>

          <div className="mt-20 h-[calc(100vh-6rem)] md:hidden">
            <MapComponent className="animate-scale h-[calc(100vh-6rem)] overflow-hidden rounded-md border-2 border-border" />
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
        <ResizablePanel collapsible={true} className="md:h-[calc(100vh-5rem)]">
          <MapComponent className="animate-scale h-[calc(100vh-6rem)] overflow-hidden rounded-md border-2 border-border" />
          {/* <Button
            className="absolute left-0 top-0"
            onClick={() => {
              mapRef.current?.collapse();
              chatRef.current?.expand();
            }}
          >
            Resize
          </Button> */}
        </ResizablePanel>
        <ResizablePanel
          ref={chatRef}
          collapsible={true}
          defaultSize={30}
          className="relative"
        >
          <Chat
            disasterId="test"
            className="min-h-[calc(100vh-6rem)] rounded-lg border-2 border-border bg-foreground/50"
          />
          <X
            className="absolute right-1 top-1 stroke-primary/50"
            onClick={() => {
              mapRef.current?.expand();
              chatRef.current?.collapse();
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
