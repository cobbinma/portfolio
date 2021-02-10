import React from "react";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import theme from "../theme";

const MyApp = ({ Component, pageProps }) => {
  return (
    <React.Fragment>
      <Head>
        <title>cobbing.dev</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta property="og:url" content="https://cobbing.dev" key="ogurl" />
        <meta
          property="og:image"
          content="https://images.ctfassets.net/xcavdzt870rr/69KVWlfZcObV6j13OU2wB5/1b7a08968880e278474aa6af5b6a9f41/avataaars.png"
          key="ogimage"
        />
        <meta property="og:site_name" content="cobbing.dev" key="ogsitename" />
        <meta property="og:title" content="cobbing.dev" key="ogtitle" />
        <meta
          property="og:description"
          content="Matthew Cobbing's Portfolio Website"
          key="ogdesc"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default MyApp;
