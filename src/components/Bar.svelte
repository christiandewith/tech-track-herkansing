<script>
  import * as d3 from "d3";
  import { onMount } from 'svelte';
  import { getCleanedTopScorers } from '$lib/dataClean.js';

  let selectedSeason = 2025;
  let tooltip = { visible: false, x: 0, y: 0, data: null };

  async function renderChart() {
    // Chart dimensions
    const width = 1400;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    // Fetch player data
    const players = await getCleanedTopScorers({ league: 39, season: selectedSeason });
    if (!Array.isArray(players) || players.length === 0) return;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([d3.min(players, d => d.games) - 1, d3.max(players, d => d.games)])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(players, d => d.goals) - 1, d3.max(players, d => d.goals)])
      .range([height - margin.bottom, margin.top]);

    // Setup SVG
    const svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    // Add X axis (games) with integer ticks only
    const [xMin, xMax] = xScale.domain();
    const xTicks = d3.range(Math.floor(xMin), Math.ceil(xMax) + 1);

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickValues(xTicks).tickFormat(d3.format('d')));

    // Add Y axis (goals) with integer ticks only
    const [yMin, yMax] = yScale.domain();
    const yTicks = d3.range(Math.floor(yMin), Math.ceil(yMax) + 1);

    svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickValues(yTicks).tickFormat(d3.format('d')));
    
    // Axis labels
    // X label: Games Played (centered under the axis)
    svg.append('text')
      .attr('class', 'axis-label axis-label--x')
      .attr('x', (width) / 2)
      .attr('y', height - 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .text('Games Played');

    // Y label: Goals (rotated, centered along the axis)
    svg.append('text')
      .attr('class', 'axis-label axis-label--y')
      .attr('transform', `rotate(-90)`)
      .attr('x', -(height / 2))
      .attr('y', 16)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .text('Goals');
    
    // Add lines from origin to each player
    const originX = xScale(xMin);
    const originY = yScale(yMin);
    const maxGoals = d3.max(players, d => d.goals);

    svg.selectAll('.player-line')
      .data(players)
      .join('line')
      .attr('class', 'player-line')
      .attr('x1', originX)
      .attr('y1', originY)
      .attr('x2', d => xScale(d.games))
      .attr('y2', d => yScale(d.goals))
      .attr('stroke', d => d.goals === maxGoals ? '#e55838' : '#cccccc')
      .attr('stroke-width', d => d.goals === maxGoals ? 3 : 1)
      .attr('opacity', d => d.goals === maxGoals ? 1 : 0.9);

    // Add club logos
    const logoSize = 40;
    const logoSizeHover = 50;

    svg.selectAll('.player-logo')
      .data(players)
      .join('image')
      .attr('class', 'player-logo')
      .attr('x', d => xScale(d.games) - logoSize/2)
      .attr('y', d => yScale(d.goals) - logoSize/2)
      .attr('width', logoSize)
      .attr('height', logoSize)
      .attr('href', d => d.photo)
      .on('mouseover', function (event, d) {
        // Show tooltip
        tooltip = {
          visible: true,
          x: event.clientX + 10,
          y: event.clientY + 10,
          data: d
        };
        
        d3.select(this)
          .transition()
          .duration(200)
          .attr('width', logoSizeHover)
          .attr('height', logoSizeHover)
          .attr('x', d => xScale(d.games) - logoSizeHover/2)
          .attr('y', d => yScale(d.goals) - logoSizeHover/2)
          .attr('opacity', 1);
      })
      .on('mousemove', function (event) {
        // Update tooltip position
        tooltip.x = event.clientX + 10;
        tooltip.y = event.clientY + 10;
      })
      .on('mouseout', function (event, d) {
        // Hide tooltip
        tooltip = { visible: false, x: 0, y: 0, data: null };
        
        d3.select(this)
          .transition()
          .duration(200)
          .attr('width', logoSize)
          .attr('height', logoSize)
          .attr('x', d => xScale(d.games) - logoSize/2)
          .attr('y', d => yScale(d.goals) - logoSize/2)
          .attr('opacity', 0.8);
      });

    // Add player name labels below logos
    svg.selectAll('.player-label')
      .data(players)
      .join('text')
      .attr('class', 'player-label')
      .attr('x', d => xScale(d.games))
      .attr('y', d => yScale(d.goals) + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('fill', '#e55838')
      .attr('pointer-events', 'none')
      .text(d => d.lastname);
  }

  onMount(() => {
    renderChart();
  });

  function changeSeason(season) {
    selectedSeason = season;
    renderChart();
  }
</script>

<div class="chart-wrapper">
  <div class="season-buttons">
    <button 
      class:active={selectedSeason === 2022} 
      on:click={() => changeSeason(2022)}
    >
      2022/2023
    </button>
    <button 
      class:active={selectedSeason === 2023} 
      on:click={() => changeSeason(2023)}
    >
      2023/2024
    </button>
    <button 
      class:active={selectedSeason === 2024} 
      on:click={() => changeSeason(2024)}
    >
      2024/2025
    </button>
    <button 
      class:active={selectedSeason === 2025} 
      on:click={() => changeSeason(2025)}
    >
      2025/2026
    </button>
  </div>
  <svg></svg>
  
  {#if tooltip.visible && tooltip.data}
    <div 
      class="tooltip" 
      style="left: {tooltip.x}px; top: {tooltip.y}px;"
    >
      <div class="tooltip-header">
        <strong>{tooltip.data.lastname}</strong>
        {#if tooltip.data.logo}
          <img src={tooltip.data.logo} alt={tooltip.data.team} class="tooltip-logo" />
        {/if}
      </div>
      <div class="tooltip-team">{tooltip.data.team}</div>
      <div class="tooltip-stats">
        <div class="stat">
          <span class="stat-label">Goals:</span>
          <span class="stat-value">{tooltip.data.goals}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Assists:</span>
          <span class="stat-value">{tooltip.data.assists || 0}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Games:</span>
          <span class="stat-value">{tooltip.data.games}</span>
        </div>
        <div class="stat highlight">
          <span class="stat-label">Goals/Game:</span>
          <span class="stat-value">{(tooltip.data.goals / tooltip.data.games).toFixed(2)}</span>
        </div>
      </div>
    </div>
  {/if}
</div>
