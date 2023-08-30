import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import HeroGraph from './HeroGraph';
import HeroPage from './HeroPage'; // This component is yet to be created

function App({ heroes, graphData}) {

  return (
      <div className="App">
        <header className="App-header">
          <h1>Hero Friendship Graph</h1>

          {/* Render hero buttons */}
          {heroes.map((hero) => (
            <Link key={hero.id} to={`/hero/${hero.name}`}>
              <button>{hero.name}</button>
            </Link>
          ))}

          {/* Main graph */}
            <HeroGraph data={graphData} />
        </header>
      </div>
  );
}

export default App;
