import * as React from "react";
import { motion } from "framer-motion";
import { MenuItem } from "./MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      margin: 0,
      padding: 25,
      position: "absolute",
      top: 100,
      width: 230,
      zIndex: 2,
    },
    link: {
      color: "#111111",
      textDecoration: "none",
    },
  })
);

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export const Navigation = ({ toggle }: any) => {
  const classes = useStyles();
  return (
    <motion.ul className={classes.list} variants={variants}>
      <Link href="/">
        <a className={classes.link} onClick={toggle}>
          <MenuItem title="home" icon="home" />
        </a>
      </Link>
      <Link href="/projects">
        <a className={classes.link} onClick={toggle}>
          <MenuItem title="projects" icon="code" />
        </a>
      </Link>
    </motion.ul>
  );
};
