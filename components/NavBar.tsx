import React, { useEffect } from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    background: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 300,
      background: "#fff",
      zIndex: 2,
    },
    nav: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: 300,
    },
  })
);

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
  }, [ref]);

  return dimensions.current;
};

const NavBar = () => {
  const classes = useStyles();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      className={classes.nav}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      <motion.div className={classes.background} variants={sidebar} />
      {isOpen ? <Navigation toggle={() => toggleOpen()} /> : undefined}
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};

export default NavBar;
