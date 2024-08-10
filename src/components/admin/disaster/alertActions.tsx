import React, { type FC } from "react";
import { LuMoreHorizontal } from "react-icons/lu";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { api } from "~/utils/api";

const Actions: FC<{ disasterId: string }> = ({ disasterId }) => {
  const markDisasterAlertAs = api.disaster.markDisasterAlertAs.useMutation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>
          <LuMoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            markDisasterAlertAs.mutate(
              {
                id: disasterId,
                status: "FAKE",
              },
              {
                onSuccess: () => {
                  toast.success("Disaster marked as fake");
                },
                onError: ({ message }) => {
                  toast.error(message);
                },
              },
            );
          }}
        >
          Mark Fake
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            markDisasterAlertAs.mutate(
              {
                id: disasterId,
                status: "ONGOING",
              },
              {
                onSuccess: () => {
                  toast.success("Disaster marked as ongoing");
                },
                onError: ({ message }) => {
                  toast.error(message);
                },
              },
            );
          }}
        >
          Mark Ongoing
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            markDisasterAlertAs.mutate(
              {
                id: disasterId,
                status: "RESOLVED",
              },
              {
                onSuccess: () => {
                  toast.success("Disaster marked as resolved");
                },
                onError: ({ message }) => {
                  toast.error(message);
                },
              },
            );
          }}
        >
          Mark Resolved
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
