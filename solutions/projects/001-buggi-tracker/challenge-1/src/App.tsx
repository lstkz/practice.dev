import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import './styles.css';

function App() {
  React.useEffect(() => {
    console.log('l!!!!!!!!!!loaded55');
  }, []);

  // const [] = React.;
  return (
    <div className="App">
      <h1>1234</h1>
      <h2>Start editing to see some magic happen!</h2>
      <input type="text" />
    </div>
  );
}

export default hot(App);
