import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" cross-origin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/assets/img/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/assets/img/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon/favicon-16x16.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/assets/img/favicon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <body className="jumping">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
