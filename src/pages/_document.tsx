import { Html, Head, Main, NextScript } from "next/document";

import { siteMetaData } from "~/constants";

export default function Document() {
  return (
    <Html lang="en">
      {/* Title of the page is being set in _app.tsx */}
      <Head>
        <meta name="title" content={siteMetaData.title} />
        <meta name="description" content={siteMetaData.description} />
        <meta name="author" content={siteMetaData.author} />
        <meta name="teamName" content={siteMetaData.teamName} />
        <meta name="organization" content={siteMetaData.organization} />
        <meta
          name="application-name"
          content={siteMetaData["application-name"]}
        />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="robots" content="index, follow" />
        <meta name="cache-control" content="private, max-age=3600" />
        <meta name="pragma" content="private, max-age=3600" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
