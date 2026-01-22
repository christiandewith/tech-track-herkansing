<script>
  import { onMount } from 'svelte';
  import { getTeamGoalStats } from '$lib/dataClean.js';

  let teams = [];
  let loading = true;
  let selectedSeason = 2025;

  async function loadTeamData() {
    loading = true;
    try {
      teams = await getTeamGoalStats({ league: 39, season: selectedSeason });
      console.log('Team goal stats loaded:', teams);
    } catch (err) {
      console.error('Error loading team goals:', err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadTeamData();
  });

  function changeSeason(season) {
    selectedSeason = season;
    loadTeamData();
  }
</script>

<div class="team-goals">
  <h2>Team Goal Statistics</h2>
  
  <div class="season-selector">
    <button 
      class:active={selectedSeason === 2022} 
      on:click={() => changeSeason(2022)}
    >
      2022/23
    </button>
    <button 
      class:active={selectedSeason === 2023} 
      on:click={() => changeSeason(2023)}
    >
      2023/24
    </button>
    <button 
      class:active={selectedSeason === 2024} 
      on:click={() => changeSeason(2024)}
    >
      2024/25
    </button>
    <button 
      class:active={selectedSeason === 2025} 
      on:click={() => changeSeason(2025)}
    >
      2025/26
    </button>
  </div>

  {#if loading}
    <p class="loading">Loading team data...</p>
  {:else}
    <div class="teams-grid">
      {#each teams as team, index (team.team)}
        <div class="team-card">
          <div class="team-header">
            <span class="rank">#{index + 1}</span>
            {#if team.logo}
              <img src={team.logo} alt={team.team} class="team-logo" />
            {/if}
            <h3 class="team-name">{team.team}</h3>
          </div>
          <div class="team-stats">
            <div class="stat-row main-stat">
              <span class="stat-label">Total Goals:</span>
              <span class="stat-value large">{team.totalGoals}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Top Scorer:</span>
              <span class="stat-value">{team.topScorer}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">Top Scorer %:</span>
              <span class="stat-value highlight">{team.topScorerPercentage}%</span>
            </div>
            <div class="percentage-bar">
              <div class="bar-fill" style="width: {team.topScorerPercentage}%"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
