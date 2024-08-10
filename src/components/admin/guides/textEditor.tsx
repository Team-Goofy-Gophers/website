import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import "react-quill/dist/quill.snow.css";

import { modules } from "./constants";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function Editor({
  text,
  setText,
}: {
  text: string;
  setText: (text: string) => void;
}) {
  const onChange = (text: string) => {
    setText(text);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.css"
        />
      </Head>

      <div>
        <ReactQuill
          theme="snow"
          placeholder="Type here"
          value={text}
          onChange={onChange}
          modules={modules}
        />
      </div>
    </>
  );
}
