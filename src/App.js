import React, { useState } from 'react';
import { Button, Input } from 'antd';
import _ from 'lodash';
import Test from './Test';
import './App.css';

const initialKey = _.uniqueId();

function App() {
  const [key, setKey] = useState(initialKey);
  const [value, handleChange] = useState();
  return (
    <div className="App">
      <Test key={key} />
      <Button onClick={() => { setKey(_.uniqueId()) }}>点击</Button>
      <Input value={value} onChange={(e) => { handleChange(e.target.value) }} />
    </div>
  );
}

export default App;
