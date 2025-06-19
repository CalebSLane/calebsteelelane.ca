import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button/Button';

const App = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {toggle && <p>Hello, World!</p>}
        {!toggle && <p>Goodbye, World!</p>}
        <Button setToggle={setToggle} btnTxt="Toggle Text" />
      </header>
    </div>
  );
};

export default App;
