import { Html, Head, Main, NextScript } from "next/document";

import { siteMetaData } from "~/constants";

export default function Document() {
  return (
    <Html lang="en">
      {/* Title of the page is being set in _app.tsx */}
      <Head>
        <meta name="title" content={siteMetaData.title} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
