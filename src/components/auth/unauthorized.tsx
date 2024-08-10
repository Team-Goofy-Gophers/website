import { type User } from "next-auth";
import { signOut } from "next-auth/react";
import React, { type FunctionComponent } from "react";
import { LuLogOut } from "react-icons/lu";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Props {
  user: User;
}

const Unauthorized: FunctionComponent<Props> = ({ user }) => {
  return (
    <div className="h-screen w-screen">
      {/* <SpaceBG> */}
      <div className="flex size-full items-center justify-center p-3">
        <Card className="backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Not Authorized</CardTitle>
            <CardDescription>Error 401</CardDescription>
          </CardHeader>
          <CardContent className="flex max-w-prose flex-col gap-3">
            <div>You are not authorized to access this website.</div>
            <div>
              If you think this is an error, verify that you are signed in with
              the correct account.
            </div>
            <div>
              You are currently signed in as{" "}
              <span className="font-bold">{user.name}</span> (
              <span className="font-bold">{user.email}</span>) through Google.
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={async () => {
                await signOut();
              }}
            >
              <LuLogOut className="mr-2 size-5" />
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* </SpaceBG> */}
    </div>
  );
};

export default Unauthorized;
