---
layout: ../../layouts/Article.astro
title: Introduction to Astro
author: Matthew Cobbing
description: "I rewrote this site using Astro and here's what I thought."
image:
  url: "https://images.unsplash.com/photo-1598585774711-f7638e3e3520?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&fm=jpg&w=700&fit=max"
  alt: "Nebulous region in the constellation Cygnus"
pubDate: 2023-04-13T09:00:00.000Z
---

## What's Astro?

[Astro](https://astro.build/) is a tool for building static websites. It allows you to write sites using a variety of Javascript frameworks by shipping zero Javascript to the browser.

It acts like a static site generator but allows you to use interactive components if needed.

![](https://avatars.githubusercontent.com/u/44914786?s=280&v=4)

## The Rewrite

My original aim was to add a blog section to this site. The site previously only had a projects section and I had added articles to medium.

The site used to be made with Next.js and got its content from Contentful CMS using GraphQL. I decided it was going to be too much effort to add blogging to the site using this architecture. I felt the site was overengineered given its simplicity and chose to rewrite it to use static content from the repository in order to reduce complexity.

I could have continued to use Next.js but it had been a while since I last updated the site and I wanted to start fresh so I chose to use an alternative framework.

After looking at the numerous static site generators, I decided to use [Hugo](https://github.com/gohugoio/hugo). It promised to be easy to setup and get running using Markdown files and an existing template. It was extremely easy. In about an hour, I had created the site from scratch, deployed , and it looked pretty good 👍.

Almost immediately after building the site with Hugo, I noticed that customising the site beyond the template was actually quite difficult. The template had a small bug in a footer, and that meant I needed to fork the whole thing and set up an alternative git module in order to fix it. Using the template also felt more like creating a Tumblr profile and not updating my own site.

![](https://media.giphy.com/media/1sMTqiUC3OlfG/giphy.gif)

I wasn't really happy with my new site, and wanted something that was still simple to use but also allowed me to fully customise how the site looked. That's when I found Astro.

I had seen a [video](https://www.youtube.com/watch?v=dsTXcSeAZq8) about Astro but didn't realise it was so suited to what I wanted to do.

After looking at the docs, I decided to try it out and found the 'Build your first Astro Blog' tutorial on their site. The tutorial was very easy to follow, and I ended up rewriting most of the site after going through it.

## Verdict

The components are very similar of ReactJS, so they were easy to understand. The typescript support is ok, but I would like an error if I tried to deconstruct a field that wasn't in that component's `Props`.

```astro
---
interface Props {
  url?: string;
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  pubDate?: string;
}

const { url, title, image, description, pubDate } = Astro.props;
---

<div>
  <a class="secondary" href={url}>
    <article>
      <h5>{title}</h5>
      <small class="description">{description}</small>
      <img src={image.url} alt={image.alt} />
      {pubDate && <small class="footer">{pubDate.slice(0, 10)}</small>}
    </article>
  </a>
</div>
```

It was very easy to copy the markdown files from the Hugo site and use them. Using a layout with markdown files is really easy with the addition of a single line.

```markdown
---
layout: ../../layouts/Article.astro
---
```

Importing the contents of the markdown files into other components was also simple by using the `glob` function. I would have liked some kind of error if I tried to use a markdown file that didn't comply with the Typescript interface instead of failing to render the page.

```astro
---
const articles = await Astro.glob<Article>("../pages/articles/*.md");
---
```

Due to the simplicity of the site, I haven't been able to use any more advanced features yet and have only used Astro components. Going forward, I want to keep adding to my site, so I may need some interactive components. I want to use Svelte somewhere when I have a chance.

Overall, I really liked using Astro 🌟. It was extremely intuitive to use, and I have full control over my site's layout.
