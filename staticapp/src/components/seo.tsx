import { IGatsbyImageData } from 'gatsby-plugin-image';
import { useSiteMetadata } from '../hooks/use-site-metadata';
import React from 'react';

type SEOProps = {
  title?: string;
  description?: string;
  pathname?: string;
  openGraphImageSrc?: string;
  children?: React.ReactNode;
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  pathname,
  openGraphImageSrc,
  children,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    keywords,
    image,
    siteUrl,
  } = useSiteMetadata();

  const ogImage = image?.childImageSharp?.gatsbyImageData as unknown as IGatsbyImageData;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    keywords: keywords,
    imagePath: ogImage?.images.fallback?.src,
    url: `${siteUrl}${pathname || ``}`,
  };

  return (
    <>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.imagePath} />
      <meta name="keywords" content={keywords} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={seo.imagePath} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.imagePath} />
      {/* <link rel="icon" href={seo.imagePath} /> */}
      {children}
    </>
  );
};
