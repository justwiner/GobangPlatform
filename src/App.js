import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button>default</Button>
          <Button type="primary">primary</Button>
        </header>
      </div>
    );
  }
}

export default App;
