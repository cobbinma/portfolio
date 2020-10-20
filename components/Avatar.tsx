import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      borderRadius: "50%",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
      height: "auto",
    },
  })
);

export const Avatar = (props: { url: string }) => {
  const classes = useStyles();
  return (
    <div>
      <img className={classes.avatar} alt="me" src={props.url} />
    </div>
  );
};
