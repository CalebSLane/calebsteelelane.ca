import { graphql, useStaticQuery } from 'gatsby';

export const useSiteMetadata = () => {
  const { site, image } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          keywords
          siteUrl
        }
      }
      image: file(relativePath: { eq: "thisWebsite.png" }) {
        childImageSharp {
          gatsbyImageData(layout: FIXED, height: 580, width: 1200)
        }
      }
    }
  `);

  return {
    ...site.siteMetadata,
    image,
  };
};
export type SiteMetadata = ReturnType<typeof useSiteMetadata>;
