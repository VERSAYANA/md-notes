import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/icon.png" />

        {/* Open graph */}
        <meta property="og:title" content="Markdown Notes" />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Write public or private notes using markdown."
        />

        {/* Twitter */}
        <meta property="twitter:title" content="Make your crypto profile" />
        <meta
          property="twitter:description"
          content="Write public or private notes using markdown."
        />
      </Head>
      <body className="bg-base-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
