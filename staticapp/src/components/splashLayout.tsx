import React, { PropsWithChildren } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Link, PageProps } from 'gatsby';
import { faGithub, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Layout: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  function pathNameEquals(pathName: string) {
    if (typeof window !== 'undefined') {
      return window.location.pathname === pathName;
    }
  }

  return (
    <>
      <header id="home" className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
          <a className="pure-menu-heading" href="/">
            <StaticImage
              src="../images/logo.png"
              alt="CSL Logo"
              placeholder="blurred"
              layout="fixed"
              width={40}
              height={40}
            />
          </a>
          <nav style={{ position: 'absolute', top: 5 }} className="pure-menu pure-menu-horizontal">
            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <Link to="/" className="pure-menu-link">
                  Home
                </Link>
              </li>
              <li className="pure-menu-item">
                <Link to="/Projects" className="pure-menu-link">
                  Projects
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main aria-label="Main content">
        <div className="body">{props.children}</div>
      </main>

      <footer className="footer l-box is-center">
        <p>
          If you have any questions, comments, feel free to reach out to me via email at{' '}
          <a href="mailto:caleb@cleeb.ca">caleb@cleeb.ca</a> or via the social media links
          <span className="socials">
            <a
              href="https://www.linkedin.com/in/calebsteele-lane"
              target="_blank"
              aria-label="LinkedIn link"
            >
              <FontAwesomeIcon
                className="socials-icon"
                icon={faLinkedin}
                aria-label="LinkedIn icon"
              />
            </a>
            <a href="https://github.com/CalebSLane" target="_blank" aria-label="GitHub link">
              <FontAwesomeIcon className="socials-icon" icon={faGithub} aria-label="GitHub icon" />
            </a>
            <a
              href="https://www.instagram.com/calebslane/"
              target="_blank"
              aria-label="Instagram link"
            >
              <FontAwesomeIcon
                className="socials-icon"
                icon={faInstagram}
                aria-label="Instagram icon"
              />
            </a>
          </span>
        </p>
      </footer>
    </>
  );
};

export default Layout;
