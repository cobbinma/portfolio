import * as React from "react";
import { motion } from "framer-motion";
import Typography from "@material-ui/core/Typography";
import HomeIcon from "@material-ui/icons/Home";
import CodeIcon from "@material-ui/icons/Code";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      flex: "40px 0",
      marginRight: 20,
    },
    text: {
      borderRadius: 5,
      width: 200,
      height: 20,
      flex: 1,
      textTransform: "uppercase",
      fontWeight: "bold",
    },
    listItem: {
      margin: 0,
      padding: 0,
      listStyle: "none",
      marginBottom: 20,
      display: "flex",
      alignItems: "top",
      cursor: "pointer",
    },
  })
);

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

interface Props {
  title: string;
  icon: string;
}

const Icon = (icon: string) => {
  switch (icon) {
    case "home":
      return <HomeIcon />;
    case "code":
      return <CodeIcon />;
    default:
      return null;
  }
};

export const MenuItem: React.FC<Props> = ({ title, icon }) => {
  const classes = useStyles();
  return (
    <motion.li
      className={classes.listItem}
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={classes.icon}>{Icon(icon)}</div>
      <div className={classes.text}>
        <Typography>{title}</Typography>
      </div>
    </motion.li>
  );
};
