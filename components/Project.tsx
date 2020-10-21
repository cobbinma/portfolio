import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import GitHubIcon from "@material-ui/icons/GitHub";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Project as ProjectType } from "../services/portfolio.types";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100%",
      flexWrap: "wrap",
    },
    body: {
      width: "100%",
      flex: "1 0 auto",
      justifyContent: "center",
    },
    media: {
      width: "100%",
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    actions: {
      alignSelf: "flex-end",
    },
  })
);

const Project: React.FC<ProjectType> = ({
  title,
  description,
  link,
  picture,
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <div className={classes.body}>
        <CardHeader title={title} />
        <CardMedia
          className={classes.media}
          image={picture.url}
          title={title}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </div>
      <CardActions className={classes.actions} disableSpacing>
        <IconButton aria-label="github link" href={link}>
          <GitHubIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Project;
