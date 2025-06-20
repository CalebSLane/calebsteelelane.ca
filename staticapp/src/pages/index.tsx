import * as React from 'react';
import { Link } from 'gatsby';
import type { HeadFC, PageProps } from 'gatsby';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive.css';
import '../css/styles.css';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main>
      <div className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
          <a className="pure-menu-heading" href="">
            Your Site
          </a>

          <ul className="pure-menu-list">
            <li className="pure-menu-item pure-menu-selected">
              <a href="#" className="pure-menu-link">
                Home
              </a>
            </li>
            <li className="pure-menu-item">
              <a href="#" className="pure-menu-link">
                Tour
              </a>
            </li>
            <li className="pure-menu-item">
              <a href="#" className="pure-menu-link">
                Sign Up
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="splash-container">
        <div className="splash">
          <p className="splash-subhead">Hello, my name is</p>
          <h1 className="splash-head">Caleb Steele-Lane</h1>
          <p className="splash-subhead">I am a software engineer and web security consultant</p>
          <p>
            <a href="http://purecss.io" className="pure-button pure-button-primary">
              Get Started
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
                <i className="fa fa-rocket"></i>
                Full-Stack Web Development
              </h3>
              <p>
                I have a background in both front-end and back-end development, using a range of
                software languages and frameworks.
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">
                <i className="fa fa-mobile"></i>
                Web Security Analysis
              </h3>
              <p>
                I have experience in web security, including vulnerability assessment and
                penetration testing.
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">
                <i className="fa fa-th-large"></i>
                DevOps
              </h3>
              <p>
                Many of the applications I've worked on have strong DevOps components, including
                CI/CD pipelines, containerization, etc.
              </p>
            </div>
            <div className="l-box pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
              <h3 className="content-subhead">
                <i className="fa fa-check-square-o"></i>
                Plays Nice
              </h3>
              <p>
                Phasellus eget enim eu lectus faucibus vestibulum. Suspendisse sodales pellentesque
                elementum.
              </p>
            </div>
          </div>
        </div>

        <div className="ribbon l-box-lrg pure-g">
          <div className="l-box-lrg is-center pure-u-1 pure-u-md-1-2 pure-u-lg-2-5">
            <img
              width="300"
              alt="File Icons"
              className="pure-img-responsive"
              src="/img/common/file-icons.png"
            />
          </div>
          <div className="pure-u-1 pure-u-md-1-2 pure-u-lg-3-5">
            <h2 className="content-head content-head-ribbon">Laboris nisi ut aliquip.</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor.
            </p>
          </div>
        </div>

        <div className="content">
          <h2 className="content-head is-center">Dolore magna aliqua. Uis aute irure.</h2>

          <div className="pure-g">
            <div className="l-box-lrg pure-u-1 pure-u-md-2-5">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <label htmlFor="name">Your Name</label>
                  <input id="name" type="text" placeholder="Your Name" />

                  <label htmlFor="email">Your Email</label>
                  <input id="email" type="email" placeholder="Your Email" />

                  <label htmlFor="password">Your Password</label>
                  <input id="password" type="password" placeholder="Your Password" />

                  <button type="submit" className="pure-button">
                    Sign Up
                  </button>
                </fieldset>
              </form>
            </div>

            <div className="l-box-lrg pure-u-1 pure-u-md-3-5">
              <h4>Contact Us</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h4>More Information</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
