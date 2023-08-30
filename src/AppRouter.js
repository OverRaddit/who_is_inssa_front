import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import HeroPage from './HeroPage'; // assuming you have a component for an individual hero's page

function AppRouter() {
  const [heroes, setHeroes] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetch('http://localhost:3000/api/heroes/friendships')
      .then(response => response.json())
      .then(data => {
        setHeroes(data.nodes);
        setGraphData(data)
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App heroes={heroes} graphData={graphData} />} />
        <Route path="/hero/:name" element={<HeroPage heroes={heroes} graphData={graphData} setGraphData={setGraphData} />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
