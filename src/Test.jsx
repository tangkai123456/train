import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [value, handleChange] = useState();

  useEffect(() => {
    console.log("Hello useEffest,console ", count);
    return () => {
      console.log("Goodbye useEffest");
    }
  }, [count])

  useEffect(() => {
    console.log("Hello useEffest too,console ", count);
    return () => {
      console.log("Goodbye useEffest again");
    }
  })

  console.log(count);
  setTimeout(() => {
    console.log('immediate');
  }, 0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <Input value={value} onChange={(e) => { handleChange(e.target.value) }} />
    </div>
  );
}

export default Example;