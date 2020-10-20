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
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default MyApp;
