import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return <div>it works</div>;
}

const MOUNT_NODE = document.getElementById('root');

ReactDOM.render(<App />, MOUNT_NODE);
