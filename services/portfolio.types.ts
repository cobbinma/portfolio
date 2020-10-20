export type HomePage = {
  firstName: string;
  secondName: string;
  introduction: string;
  avatar: Image;
  socials: Social[];
};

export type Image = {
  url: string;
};

export type Social = {
  id: number;
  name: string;
  logo: Image;
  url: string;
};

export type ProjectsPage = {
  projects: Project[];
  technologies: Technology[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  link: string;
  picture: Image;
  technologies: Technology[];
};

export type Technology = {
  title: string;
};
