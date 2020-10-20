import { ContentfulClientApi, createClient } from "contentful";
import { HomePage, Social } from "./portfolio.types";

export class PortfolioApi {
  client: ContentfulClientApi;

  constructor() {
    this.client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
  }

  async fetchHomePageById(id): Promise<HomePage> {
    return await this.client.getEntry(id).then((entry) => {
      if (entry) {
        return this.convertHomePage(entry);
      }
      return null;
    });
  }

  convertHomePage = (rawData): HomePage => {
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
}
