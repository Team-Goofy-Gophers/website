import { APIProvider } from "@vis.gl/react-google-maps";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

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
        defaultTheme="light"
        disableTransitionOnChange
      >
        <APIProvider apiKey={env.NEXT_PUBLIC_MAPS_API_KEY}>
          <Head>
            {/* Google Translate */}
            <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></Script>
            {/* Google Translate CSS */}
            <link
              rel="stylesheet"
              type="text/css"
              href="https://www.gstatic.com/_/translate_http/_/ss/k=translate_http.tr.26tY-h6gH9w.L.W.O/am=CAM/d=0/rs=AN8SPfpIXxhebB2A47D9J-MACsXmFF6Vew/m=el_main_css"
            />
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
