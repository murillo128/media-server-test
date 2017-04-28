import React from 'react';
import './App.css';
import Home from './pages/home';

class App extends React.PureComponent {

    render() {

        let component = this.props.children || <Home />;

        return (
          <div className="App">
              {component}
          </div>
        );
    }
}

export default App;
