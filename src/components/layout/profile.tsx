import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

export default function Profile() {
  const session = useSession();

  React.useEffect(() => {
    console.log(session);
  }, [session]);

  if (session.status === "unauthenticated") {
    return (
      <>
        <Button onClick={() => signIn("google")}>Sign In</Button>
      </>
    );
  } else if (session.status === "authenticated") {
    return (
      <>
        <Popover>
          <PopoverTrigger className="w-fit">
            <Avatar>
              <AvatarImage
                src={session.data.user.image ?? "/images/placeholder.png"}
                alt="@gg"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <Button onClick={() => signOut()} className="w-full">
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </>
    );
  }
}
