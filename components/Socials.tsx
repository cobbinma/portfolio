import React from "react";
import Grid from "@material-ui/core/Grid";
import { Social, SocialProps } from "./Social";

interface Props {
  socials: SocialProps[];
}

export const Socials: React.FC<Props> = ({ socials }) => {
  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center">
        {socials.map((social: SocialProps) => {
          return <Social key={social.name} {...social} />;
        })}
      </Grid>
    </div>
  );
};
