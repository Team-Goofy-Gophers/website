import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { type ReactNode, type FunctionComponent } from "react";
import { Toaster } from "sonner";

import Unauthorized from "~/components/auth/unauthorized";
import Footer from "~/components/layout/footer";
import NavBar from "~/components/layout/navbar";
import Loader from "~/components/loader";
import { useLoading } from "~/hooks";

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const loading = useLoading();

  if (status === "loading")
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );

  // if (status === "unauthenticated") void router.push("/");

  if (
    status === "authenticated" &&
    pathname.startsWith("/admin") &&
    session.user.role !== "ADMIN"
  )
    return <Unauthorized user={session.user} />;

  return (
    <div className="magicpattern flex h-screen w-screen">
      <Toaster />
      <div className="h-full w-full">
        <NavBar />
        <main id="main-section" className="min-h-[100svh] p-5">
          {loading ? (
            <div className="flex size-full items-center justify-center">
              <Loader />
            </div>
          ) : (
            children
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
