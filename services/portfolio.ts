import { createClient } from "contentful";
import {
  HomePage,
  Project,
  ProjectsPage,
  Social,
  Technology,
} from "./portfolio.types";

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const client = createClient({
  space: space,
  accessToken: accessToken,
});

export async function fetchHomePageById(id): Promise<HomePage> {
  return await client.getEntry(id).then((entry) => {
    if (entry) {
      return convertHomePage(entry);
    }
    return null;
  });
}

export async function fetchProjectsPageById(id): Promise<ProjectsPage> {
  return await client.getEntry(id, { include: 2 }).then((entry) => {
    if (entry) {
      return convertProjectsPage(entry);
    }
    return null;
  });
}

const convertHomePage = (rawData): HomePage => {
  const fields = rawData.fields;
  return {
    firstName: fields.firstName,
    secondName: fields.secondName,
    introduction: fields.introduction,
    avatar: {
      url: fields.avatar?.fields?.file.url.replace("//", "http://"),
    },
    socials: fields.socials?.map(
      (social): Social => ({
        id: social.fields?.id,
        name: social.fields?.name,
        logo: {
          url: social.fields?.logo?.fields.file.url.replace("//", "http://"),
        },
        url: social.fields?.url,
      })
    ),
  };
};

const convertProjectsPage = (rawData): ProjectsPage => {
  const fields = rawData.fields;
  return {
    projects: fields.projects?.map(
      (project): Project => ({
        id: project.fields?.id,
        title: project.fields?.title,
        description: project.fields?.description,
        link: project.fields?.url,
        picture: {
          url: project.fields?.picture?.fields.file.url.replace(
            "//",
            "http://"
          ),
        },
        technologies: project.fields?.technologies.map(
          (tech): Technology => ({
            title: tech.fields?.title,
          })
        ),
      })
    ),
    technologies: fields.technologies?.map(
      (tech): Technology => ({
        title: tech.fields?.title,
      })
    ),
  };
};
