import * as React from "react";
import { motion } from "framer-motion";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      outline: "none",
      border: "none",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      cursor: "pointer",
      position: "absolute",
      top: 18,
      left: 15,
      width: 50,
      height: 50,
      borderRadius: "50%",
      background: "transparent",
      zIndex: 3,
    },
  })
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }: any) => {
  const classes = useStyles();
  return (
    <button className={classes.button} onClick={toggle}>
      <svg width="23" height="23" viewBox="0 0 23 23">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <Path
          d="M 2 9.423 L 20 9.423"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.1 }}
        />
        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </button>
  );
};
