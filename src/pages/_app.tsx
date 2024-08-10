import { APIProvider } from "@vis.gl/react-google-maps";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import Layout from "~/components/layout";
import { siteMetaData } from "~/constants";
import { ThemeProvider } from "~/context/themeContext";
import { env } from "~/env";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Set the title of the page dynamically
  const { pathname } = useRouter();
  const title = `${
    pathname === "/"
      ? "Dashboard | "
      : pathname.split("/")[1]!.charAt(0).toUpperCase() +
        pathname.split("/")[1]!.slice(1) +
        " | "
  }${siteMetaData.title}`;

  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
          <Head>
            <title>{title}</title>
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </APIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
