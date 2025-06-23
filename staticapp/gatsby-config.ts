import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `CSL Page`,
    siteUrl: `https://cleeb.ca/`,
    description: `See what Caleb has been up to professionally`,
    // author: `@CalebSteele-Lane`,
    keywords: `developer, software engineer, security consultant, web developer, full-stack developer, javascript, java, typescript, gatsby`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    'gatsby-plugin-image',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {},
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `Caleb Steele-Lane Personal Webpage`,
        short_name: `CSL Personal Page`,
        description: `The application does cool things and makes your life better.`,
        lang: `en`,
        display: `standalone`,
        icon: `src/images/logo.png`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#fff`,
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'documents',
        path: './src/documents/',
      },
      __key: 'documents',
    },
  ],
};

export default config;
