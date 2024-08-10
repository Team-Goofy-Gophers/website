import { signIn, signOut, useSession } from "next-auth/react";
import HeroSection from "~/components/landing/HeroSection";
import { Button } from "~/components/ui/button";

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
