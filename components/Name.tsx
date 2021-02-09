import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    top: {
      color: theme.palette.primary.main,
      marginTop: 15,
      fontWeight: 800,
      textTransform: "uppercase",
    },
    bottom: {
      color: "#111111",
      lineHeight: "30%",
      fontWeight: 800,
      textTransform: "uppercase",
      "-webkit-text-stroke-width": "1px",
      "-webkit-text-stroke-color": theme.palette.secondary.main,
    },
  })
);

interface Props {
  first_name: string;
  last_name: string;
}

export const Name: React.FC<Props> = ({ first_name, last_name }) => {
  const classes = useStyles();
  return (
    <div>
      <hgroup>
        <Typography
          className={classes.top}
          align="center"
          variant="h1"
          component="h1"
        >
          {first_name}
        </Typography>
        <Typography
          className={classes.bottom}
          align="center"
          variant="h1"
          component="h1"
        >
          {last_name}
        </Typography>
      </hgroup>
    </div>
  );
};
