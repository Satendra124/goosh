import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Room } from './Pages/Room';
import { Lost } from './Pages/components/Lost';
import { Won } from './Pages/components/Won';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Room />} />
          <Route path="/won" element={<Won />} />
          <Route path="/lost" element={<Lost />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
