import React, { useState, useEffect, useRef } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import type { HeadFC, PageProps } from 'gatsby';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive.css';
import '../css/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faLink,
  faScrewdriverWrench,
  faSquareBinary,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { GatsbyImage, getImage, StaticImage } from 'gatsby-plugin-image';
import { FileNode } from 'gatsby-plugin-image/dist/src/components/hooks';
import Game from './Game';
import Layout from './SplashLayout';

type ImageFilesType = {
  file: FileNode;
};

const ProjectsPage: React.FC<PageProps> = ({ data }) => {
  const [gameOn, setGameOn] = useState(false);

  return (
    <Layout>
      <div className="splash-container">
        <div className="splash">
          {gameOn && <Game />}
          {!gameOn && (
            <>
              <p className="splash-subhead">welcome to </p>
              <h1 className="splash-head">The Projects Page</h1>
              <p className="splash-subhead">
                A.K.A where I brag about (some of) the things I've done
              </p>
            </>
          )}
          <p>
            <button
              type="button"
              className="pure-button pure-button-primary"
              aria-label={gameOn ? 'Start "Game On"' : 'end "Game On"'}
              onClick={() => setGameOn(!gameOn)}
            >
              {gameOn ? 'Stop Playing' : 'Wanna play a game?'}
            </button>
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="content">
          <h2 className="content-head is-center">
            "What are examples of software projects you've worked on?"
          </h2>
        </div>
        <div className="content ribbon l-box-lrg pure-g">
          <div className="l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
            <iframe
              src="/"
              title="this website"
              height="295"
              width="350"
              style={{ border: 'none', pointerEvents: 'none' }}
            ></iframe>{' '}
          </div>
          <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
            <h2 className="content-head content-head-ribbon">
              <StaticImage
                src="../images/logo.png"
                alt="this website logo"
                placeholder="blurred"
                height={25}
              />{' '}
              This Website
            </h2>
            <p>
              This website may look rather simple, but in the backend there is rather a lot going
              on. Some people would say it has been completely overengineered and underutilized.
              Some people would be absolutely correct to say so. This is a terrible example of a
              simple, cost effective website and would not be desireable as an end product for a
              client looking to looking for such, BUT as a playground for me to learn and experiment
              with new technologies and have fun in my spare time, it has been a great success.
            </p>
          </div>
          <div className="pure-g">
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <h3 className="content-subhead">
                <FontAwesomeIcon icon={faBars} aria-label="bars icon" />
                &nbsp; Role Description
              </h3>
              <p>
                This website is all mine. I have designed, developed, and maintained it in my spare
                time since its inception.
              </p>
              <p>In short, I am this website's god.</p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <h3 className="content-subhead">
                <FontAwesomeIcon icon={faScrewdriverWrench} aria-label="user icon" />
                &nbsp; Notable Work Done
              </h3>
              <p>
                <ul>
                  <li>
                    Hardened all dockerized services (rootless, reduced capabilities, minimal
                    images, etc.)
                  </li>
                  <li>Centralized all 'sensitive information' in a secure vault</li>
                  <li>Designed the project to be effective as a template for new webapps</li>
                  <li>Integrated with Keycloak using Oauth 2</li>
                  <li>Created helper script for easy deployment </li>
                  <li>Centralized configuration for easy modification</li>
                  <li>Husky scripts for formatting enforcement, protecting secrets, etc.</li>
                </ul>
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
              <h3 className="content-subhead">
                <FontAwesomeIcon icon={faSquareBinary} aria-label="binary icon" />
                &nbsp; Technology & Links
              </h3>
              <ul>
                <li>Husky</li>
                <li>Java (Spring Boot, Junit, Jacoco)</li>
                <li>TypeScript (React, Gatsby, Jest)</li>
                <li>KeyCloak</li>
                <li>PostgreSQL</li>
                <li>Certbot</li>
                <li>NGINX</li>
                <li>Docker (Docker Compose)</li>
              </ul>
              <ul>
                <li>
                  <a href="https://github.com/CalebSLane/calebsteelelane.ca">Source code</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="content l-box-lrg pure-g">
          <div className="l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
            <StaticImage
              src="../images/openELISGlobalLogo.png"
              alt="OpenELIS Logo"
              placeholder="blurred"
              height={300}
            />
          </div>
          <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
            <h2 className="content-head ">
              <a href="https://openelis-global.org/">
                <StaticImage
                  src="../images/openELISGlobalMini.png"
                  alt="OpenELIS Logo"
                  placeholder="blurred"
                  height={30}
                />{' '}
                OpenELIS-Global
              </a>
            </h2>

            <p>
              <a href="https://openelis-global.org/">OpenELIS-Global</a> is a Laboratory Information
              System (LIS) managed by <a href="https://digi.uw.edu/">DIGI</a> in the global health
              space that provides lab technicians with the ability to manage patient samples, order
              tests, flag important results, and auto-order potential follow up tests. It features
              extensive reporting and can communicate with other health systems and laboratory
              analyzer devices. Its use has been expanded into several countries around the world,
              including Haiti, Mauritius, and many more. Due to the nature of some of the labs it
              has to operate in, it has been designed to be operable in low-resource settings,
              including those with limited internet connectivity, power outages, and more.
            </p>
          </div>
          <div className="pure-g">
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <h3 className="content-subhead">
                <FontAwesomeIcon icon={faBars} aria-label="bars icon" />
                &nbsp; Role Description
              </h3>
              <p>
                I started with DIGI as a more junior dev, but quickly showcased my aptitudes and my
                ability to tackle more complex problems. I have worked with the team for more than 7
                years and grown with the product extensively in that time. I was not pigeon-holed
                into any one role and have worked on the products frontend, backend, security,
                devops, interoperability, and more.
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
              <h3 className="content-subhead">
                <FontAwesomeIcon icon={faScrewdriverWrench} aria-label="binary icon" />
                &nbsp; Notable Work Done
              </h3>
              <ul>
                <li>Led migration from Struts 1 to Spring</li>
                <li>Improved security to allow deployment in US Government controlled labs</li>
                <li>Led workshops and training sessions for new and old contributors</li>
                <li>Expanded interoperability with outside systems</li>
                <li>Containerized the software</li>
                <li>General feature requests and bugfixes</li>
              </ul>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-5">
              <h3 className="content-subhead">
                <FontAwesomeIcon icon={faSquareBinary} aria-label="binary icon" />
                &nbsp; Technology & Links
              </h3>
              <ul>
                <li>Java (Spring, Hibernate, Tomcat, Jackson, Log4J, Lombok)</li>
                <li>Python</li>
                <li>PostgreSQL</li>
                <li>Docker (Docker Compose, Docker Swarm)</li>
                <li>FHIR (Fast Healthcare Interoperability Resources)</li>
                <li>GitHub Actions</li>
              </ul>
              <ul>
                <li>
                  <a href="https://github.com/DIGI-UW/OpenELIS-Global-2">Source code</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;

export const Head: HeadFC = () => <title>CSL - Projects</title>;
