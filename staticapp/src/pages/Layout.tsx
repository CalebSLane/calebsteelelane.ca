import React, { PropsWithChildren } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { Link, PageProps } from 'gatsby';

const Layout: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return (
    <main>
      <div id="home" className="header">
        <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
          <a className="pure-menu-heading" href="#">
            <StaticImage
              src="../images/logo.png"
              alt="CSL Logo"
              placeholder="blurred"
              layout="fixed"
              width={40}
              height={40}
            />
          </a>
          <ul className="pure-menu-list">
            <li className="pure-menu-item pure-menu-selected">
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
        </div>
      </div>
      <div className="body">{props.children}</div>

      <div className="footer l-box is-center">
        View the source code of this website{' '}
        <a href="https://github.com/CalebSLane/calebsteelelane.ca/tree/main/staticapp">here</a> to
        see how the magic is made.
      </div>
    </main>
  );
};

export default Layout;
