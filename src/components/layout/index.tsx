import { GeistSans } from "geist/font/sans";
import { useSession } from "next-auth/react";
import React, { type ReactNode, type FunctionComponent } from "react";
import { Toaster } from "sonner";

import { useLoading } from "~/hooks";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { status, data: session } = useSession();

  const loading = useLoading();

  if (status === "loading")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        {/* <Loader /> */}
      </div>
    );

  if (status === "unauthenticated") return <>{/* <SignIn /> */}</>;

  if (status === "authenticated" && session.user.role !== "ADMIN")
    return <>{/* <Unauthorized user={session.user} /> */}</>;

  return (
    <div className="flex h-screen w-screen">
      <Toaster />
      {/* <SideNav /> */}

      <div className="flex h-full w-full flex-col">
        {/* <NavBar /> */}
        <main
          className={`${GeistSans.className} h-[calc(100vh_-_3.5rem_-2.5rem)]`}
        >
          {loading ? (
            <div className="flex size-full items-center justify-center">
              {/* <Loader /> */}
            </div>
          ) : (
            children
          )}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
