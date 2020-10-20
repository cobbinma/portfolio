import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    img: {
      filter: "invert(.8)",
      width: 50,
      height: "auto",
      borderRadius: "50%",
    },
    container: {
      padding: 10,
    },
  })
);

export interface SocialProps {
  name: string;
  logo: { url: string };
  url: string;
}

export const Social: React.FC<SocialProps> = ({ url, logo, name }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <a href={url}>
        <img className={classes.img} alt={name} src={logo.url} />
      </a>
    </div>
  );
};
