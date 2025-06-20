import React, { useState, useEffect, useRef } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import type { HeadFC, PageProps } from 'gatsby';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive.css';
import '../css/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faFileMedical,
  faInfinity,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import { FileNode } from 'gatsby-plugin-image/dist/src/components/hooks';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Game from './Game';

type ImageFilesType = {
  file: FileNode;
};

const HeroOfTimePage: React.FC<PageProps> = ({ data }) => {
  return (
    <main>
      <StaticImage
        src="../images/dangerLink.png"
        alt="the hero of time"
        placeholder="blurred"
        height={50}
      />
    </main>
  );
};

export default HeroOfTimePage;

export const Head: HeadFC = () => <title>Hero of Time</title>;
