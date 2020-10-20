export type HomePage = {
  firstName: string;
  secondName: string;
  introduction: string;
  avatar: Image;
  socials: [Social];
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
