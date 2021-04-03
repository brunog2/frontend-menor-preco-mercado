import React from 'react';
import './styles.css';
import Main from './pages/main';
import Routes from './routes';

class App extends React.Component{
  render(){
    return(      
      <div>
        <Routes />
      </div>
    );
  }
}
export default App;