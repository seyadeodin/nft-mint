import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { Install } from './Install';
import { Home } from './Home';

function App() {
  const [count, setCount] = useState(0)

  if (window.ethereum) {
    return <Home/>;
  } else {
    return <Install/>
  }

}

export default App
