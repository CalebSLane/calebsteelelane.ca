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
import Layout from './Layout';

type ImageFilesType = {
  file: FileNode;
};

const HeroOfTimePage: React.FC<PageProps> = ({ data }) => {
  return (
    <Layout>
      <div className="splash-container">
        <div className="splash">
          <StaticImage
            src="../images/dangerLink.png"
            alt="the hero of time"
            placeholder="blurred"
            height={50}
          />
        </div>
      </div>

      <div className="content-wrapper">
        <div className="content">
          <h2 className="content-head is-center">You followed a link!</h2>
        </div>
      </div>
    </Layout>
  );
};

export default HeroOfTimePage;

export const Head: HeadFC = () => <title>Hero of Time</title>;
