import { useEffect } from 'react';
import { main } from './utils/three';

function App() {
  useEffect(() => main(), []);
  return <canvas className='webgl'></canvas>;
}

export default App;
