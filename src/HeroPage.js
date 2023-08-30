import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeroGraph from './HeroGraph';

function HeroPage({ graphData, heroes, setGraphData }) {
  const { name } = useParams();
  const hero = heroes.find(h => h.name === name);

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  const handleNodeClick = (node) => {
    fetch(`http://localhost:3000/api/heroes/${node.name}/friends`)
      .then(response => response.json())
      .then(friends => {
        // create graphData
        console.log('x:', friends);
        const newNodes = [node, ...friends.nodes];
        const newLinks = friends.links.map(friend => ({
          source: node.id,
          target: friend.target
        }));

        const nodesSet = new Set(nodes.map(node => node.id));
        const uniqueNewNodes = newNodes.filter(newNode => !nodesSet.has(newNode.id));
        const combinedNodes = [...nodes, ...uniqueNewNodes];

        const linksSet = new Set(links.map(link => `${link.source.id}-${link.target.id}`));
        const uniqueNewLinks = newLinks.filter(newLink => !linksSet.has(`${newLink.source}-${newLink.target}`));
        const combinedLinks = [...links, ...uniqueNewLinks];

        console.log('linksSet:', links);
        linksSet.forEach((x, idx) => console.log('idx:',idx,'value', x));
        console.log('uniqueNewLinks:', uniqueNewLinks);
        console.log('combinedLinks:', combinedLinks);

        // update
        setNodes(combinedNodes);
        setLinks(combinedLinks);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:3000/api/heroes/${name}`)
      .then(response => response.json())
      .then(response => {
        const newNodes = [...response.nodes];
        setNodes(newNodes);
      });
  }, [])


  return (
    <div>
      {console.log('graphData:',graphData)}

      {/* {nodes.map((node, idx) => (
        <button key={idx}>{node}</button>
      ))} */}
      {console.log('nodes:',nodes)}

      <button onClick={() => handleNodeClick('Tony_Stark')}>click</button>

      <HeroGraph data={ { nodes, links } } onNodeClick={handleNodeClick} />
    </div>
  );
}

export default HeroPage;
