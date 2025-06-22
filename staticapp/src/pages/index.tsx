import React, { useState } from 'react';
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
import { StaticImage } from 'gatsby-plugin-image';
import { FileNode } from 'gatsby-plugin-image/dist/src/components/hooks';
import Layout from './SplashLayout';

type ImageFilesType = {
  file: FileNode;
};

const IndexPage: React.FC<PageProps> = ({ data }) => {
  const files = useStaticQuery(graphql`
    query {
      resume: file(relativePath: { eq: "CalebSteele-Lane-ResumeSoftware.pdf" }) {
        publicURL
        name
      }
    }
  `);

  return (
    <main>
      <Layout>
        <div className="splash-container">
          <div className="splash">
            <p className="splash-subhead">Hello, my name is</p>
            <h1 className="splash-head">Caleb Steele-Lane</h1>
            <p className="splash-subhead">I am a software engineer and security consultant</p>
            <p>
              <a
                className="pure-button pure-button-primary"
                aria-label="Download my resume"
                href={files.resume.publicURL}
                download
              >
                Download Resume
              </a>
            </p>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="content">
            <h2 className="content-head is-center">"What experience do you have?"</h2>
            <div className="pure-g">
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <FontAwesomeIcon icon={faCode} aria-label="code icon" />
                  &nbsp; Full-Stack Web Development
                </h3>
                <p>
                  I have a background in both front-end and back-end development using a range of
                  software languages and frameworks, but primarily Java, and Javascript. For a more
                  complete list of languages and frameworks, please see my{' '}
                  <Link to="/Projects">Projects</Link> page.
                </p>
              </div>
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <FontAwesomeIcon icon={faShieldHalved} aria-label="shield icon" />
                  &nbsp; Web Security Analysis
                </h3>
                <p>
                  The specialization of my undergrad degree was in Information Theory and Computer
                  Security. I have gained further professional experience in web security, including
                  vulnerability assessment and penetration testing.
                </p>
              </div>
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <FontAwesomeIcon icon={faInfinity} aria-label="infinity icon" />
                  &nbsp; DevOps & Automation
                </h3>
                <p>
                  Modern applications need strong DevOps components, including CI/CD pipelines,
                  containerization, automated testing, etc. and I have gained familiarity with many
                  technologies that provide these capabilities during my work in the industry.
                </p>
              </div>
              <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
                <h3 className="content-subhead">
                  <FontAwesomeIcon icon={faFileMedical} aria-label="medical file icon" />
                  &nbsp; Health Information Exchange
                </h3>
                <p>
                  Many of the applications I've worked on professionally have been for healthcare,
                  so I am very familiar with information exchange standards between Labratory
                  Information Systems, Medical Record Systems and analyser devices.
                </p>
              </div>
            </div>
          </div>

          <div className="ribbon l-box-lrg pure-g">
            <div className="l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <StaticImage
                src="../images/developer.jpg"
                placeholder="blurred"
                height={300}
                alt="Portrait of the developer"
              />
            </div>
            <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
              <h2 className="content-head content-head-ribbon">
                "What about who you are personally?"
              </h2>

              <p>
                I am many things. Some of those things are listed in{' '}
                <a href="https://www.youtube.com/watch?v=_ivt_N2Zcts">Meredith Brooks' hit song</a>,
                but I am also an outdoors enthusiast who enjoys backpacking, bouldering, and
                rollerblading. In true developer fashion, I also like playing video games, watching
                anime, and many more things that get people staring blankly at me at parties. I
                haven't modeled yet, but I am open to offers.
              </p>
              <p>I am also a self proclaimed comedian.</p>
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>CSL</title>;
