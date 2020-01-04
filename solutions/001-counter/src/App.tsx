import React from 'react';

export function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="main-content">
      <h1>Counter App</h1>
      Count: <span data-test="count-value">{count}</span>
      <div className="buttons">
        <button
          data-test="increase-btn"
          className="btn btn-primary"
          onClick={() => setCount(count + 1)}
        >
          Increase
        </button>
        <button
          data-test="decrease-btn"
          className="btn btn-danger"
          onClick={() => setCount(count - 1)}
        >
          Decrease
        </button>
      </div>
    </div>
  );
}
