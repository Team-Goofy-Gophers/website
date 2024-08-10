import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { env } from "~/env";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
        </div>
      </APIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
