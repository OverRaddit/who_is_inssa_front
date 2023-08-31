import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function HeroGraph({ data, onNodeClick }) {
  console.log('HeroGraph data:',data);
  //const [graphData, setGraphData] = useState({ nodes: nodes, links: links });
	const graphRef = useRef(null);

  const drawGraph = (data) => {
    const width = 1000;
    const height = 1000;

    d3.select(graphRef.current).selectAll('*').remove();
    const svg = d3.select(graphRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Arrowhead definition
    svg.append('defs').selectAll('marker')
        .data(['end'])      // Different arrowhead types can be defined here
        .enter().append('marker')
        .attr('id', String)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)   // Adjust these numbers to move the position where the arrowhead appears
        .attr('refY', -0.5)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('class', 'arrowhead');

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(400))
      //.force('charge', d3.forceManyBody().strength(-50))
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', '#aaa') // 링크에 색 표시
      .attr('marker-end', 'url(#end)'); // Apply the marker-end attribute here

    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', 5)
      .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended))
      .on('click', (d,x,y) => {
          console.log(d, '가 클릭되었습니다.');
          console.log(x, y);
          const node = d.srcElement.__data__;
          if (onNodeClick) onNodeClick(node);
      });

    node.append('title')
      .text(d => d.name);

    const label = svg.append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .text(d => d.name)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('dy', -10)  // Offset above the node
      .attr('text-anchor', 'middle');

    simulation.nodes(data.nodes).on('tick', ticked);
    simulation.force('link').links(data.links);

    function ticked() {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);

        label // Added this block
          .attr('x', d => d.x)
          .attr('y', d => d.y);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
  }

	useEffect(() => {
    if (!data.nodes.length && !data.links.length) return;
    drawGraph(data);
	}, [data]);

	return (
			<div ref={graphRef}></div>
	);
}

export default HeroGraph;
