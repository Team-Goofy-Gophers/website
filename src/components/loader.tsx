import React, { type FunctionComponent } from "react";

import { cn } from "~/lib/utils";

interface Props {
  className?: string;
}

const Loader: FunctionComponent<Props> = ({ className }) => {
  return (
    <div className={cn("relative aspect-[4/3] w-24", className)}>
      <div className="flex h-full w-full items-center justify-center gap-1 pr-1 *:h-full *:w-1/5 *:origin-bottom *:bg-white">
        <div className="animate-bar-1" />
        <div className="animate-bar-2" />
        <div className="animate-bar-3" />
        <div className="animate-bar-4" />
        <div className="animate-bar-5" />
      </div>
      <div className="animate-bounce-ball absolute bottom-1 flex h-full w-full items-end pr-5">
        <div className="aspect-square w-1/5 rounded-full bg-white" />
      </div>
    </div>
  );
};

export default Loader;
