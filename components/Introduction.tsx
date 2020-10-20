import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: {
      color: theme.palette.primary.main,
      marginBottom: 20,
    },
  })
);

interface Props {
  introduction: string;
}

export const Introduction: React.FC<Props> = ({ introduction }) => {
  const classes = useStyles();
  return (
    <div>
      <Typography
        className={classes.intro}
        align="center"
        variant="h5"
        component="h5"
      >
        {introduction}
      </Typography>
    </div>
  );
};
