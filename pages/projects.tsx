import React, { useState } from "react";
import Layout from "../components/layout";
import { NextPage } from "next";
import { fetchProjectsPageById } from "../services/portfolio";
import {
  ProjectsPage,
  Technology,
  Project as ProjectType,
} from "../services/portfolio.types";
import { Grid, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/styles";
import Project from "../components/Project";
import SearchBar from "../components/SearchBar";
import { Pagination } from "@material-ui/lab";

const PAGE_PROJECT_COUNT = 3;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      color: theme.palette.secondary.main,
      marginTop: 15,
      fontWeight: 800,
      textTransform: "uppercase",
    },
    ul: {
      "& .MuiPaginationItem-root": {
        color: "#fff",
      },
    },
  })
);

const Projects: NextPage<ProjectsPage> = ({ projects, technologies }) => {
  const classes = useStyles();
  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Technology[] | null
  >([]);
  const [page, setPage] = useState<number>(1);

  const viewProjects = projects.filter((project: ProjectType) => {
    if (selectedTechnologies == null || selectedTechnologies.length === 0)
      return true;
    return selectedTechnologies.every((tech) => {
      return project.technologies
        .map((tech) => tech.title)
        .includes(tech.title);
    });
  });

  return (
    <Layout>
      <div>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12}>
            <Typography className={classes.title} variant="h1" component="h1">
              Projects
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <SearchBar
              options={technologies}
              setOptions={setSelectedTechnologies}
              setPage={setPage}
            />
          </Grid>
          <Grid item xs={11} sm={10} md={8}>
            <Grid
              container
              spacing={2}
              direction="row"
              justify="center"
              alignItems="stretch"
            >
              {viewProjects
                .slice(
                  (page - 1) * PAGE_PROJECT_COUNT,
                  page * PAGE_PROJECT_COUNT
                )
                .map((project: ProjectType) => {
                  return (
                    <Grid key={project.title} item xs={12} sm={6} md={4} lg={4}>
                      <Project {...project} />
                    </Grid>
                  );
                })}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Pagination
              classes={{ ul: classes.ul }}
              page={page}
              onChange={(_, value) => {
                setPage(value);
                window.scrollTo(0, 0);
              }}
              count={Math.ceil(viewProjects.length / PAGE_PROJECT_COUNT)}
              color="secondary"
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

Projects.getInitialProps = async (ctx) => {
  return await fetchProjectsPageById("72g4Oy2ellnR26VCunqKFX");
};

export default Projects;
