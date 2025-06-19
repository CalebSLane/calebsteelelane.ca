import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ setToggle, btnTxt }) => {
  return (
    <button data-testid="button" onClick={() => setToggle(prev => !prev)}>
      {btnTxt}
    </button>
  );
};

Button.propTypes = {
  setToggle: PropTypes.func.isRequired,
  btnTxt: PropTypes.string.isRequired,
};

export default Button;
