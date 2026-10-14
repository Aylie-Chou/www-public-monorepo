import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html data-scroll-behavior="smooth">
      <Head>
        <link rel="stylesheet" href="/lexical-editor/style.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
