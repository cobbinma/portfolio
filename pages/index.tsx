import React from "react";
import Layout from "../components/layout";
import { NextPage } from "next";
import { PortfolioApi } from "../services/portfolio";
import { HomePage } from "../services/portfolio.types";
import { Grid } from "@material-ui/core";
import { Introduction } from "../components/Introduction";
import { Socials } from "../components/Socials";
import { Name } from "../components/Name";
import { Avatar } from "../components/Avatar";

const Home: NextPage<HomePage> = ({
  firstName,
  secondName,
  introduction,
  avatar,
  socials,
}) => {
  return (
    <Layout>
      <div>
        <Grid container alignItems="center" justify="center" spacing={3}>
          <Grid item xs={12}>
            <Name first_name={firstName} last_name={secondName} />
          </Grid>
          <Grid item xs={12}>
            <Introduction introduction={introduction} />
          </Grid>
          <Grid item xs={8} sm={4}>
            <Avatar url={avatar.url} />
          </Grid>
          <Grid item xs={12}>
            <Socials socials={socials} />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async (ctx) => {
  const api = new PortfolioApi();
  return await api.fetchHomePageById("12oQYUyzJOGG8He6aPUMJN");
};

export default Home;
