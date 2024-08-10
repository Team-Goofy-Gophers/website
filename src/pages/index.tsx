import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "~/components/ui/button";

import HeroSection from "~/components/landing/HeroSection";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <Button
          onClick={async () => {
            await signOut();
          }}
        >
          Logout
        </Button>
      ) : (
        <Button
          onClick={async () => {
            await signIn("google");
          }}
        >
          Login
        </Button>
      )}
      <HeroSection />
    </>
  );
}
