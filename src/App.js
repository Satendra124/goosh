import { useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Pages/Home';
import { Room } from './Pages/Room';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
