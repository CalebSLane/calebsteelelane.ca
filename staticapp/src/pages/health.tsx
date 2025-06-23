import React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive.css';
import '../css/styles.css';

const HealthPage: React.FC<PageProps> = ({ data }) => {
  return <div></div>;
};

export default HealthPage;

export const Head: HeadFC = () => <title>health</title>;
