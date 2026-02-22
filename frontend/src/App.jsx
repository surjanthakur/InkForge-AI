import './App.css';
import { Navbar } from './components/index';
import { BrowserRouter } from 'react-router-dom';
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </>
  );
}

export default App;
