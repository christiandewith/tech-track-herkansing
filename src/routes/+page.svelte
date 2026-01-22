<script>
  // Imports: chart component, fixtures list, data cleaning helper, lifecycle, global styles.
  import Bar from '../components/Bar.svelte';
  import TeamGoals from '../components/TeamGoals.svelte';
  import { getCumulativeTopScorers } from '$lib/dataClean.js';
  import { onMount } from 'svelte';
  import '$lib/style.css';


  // State: top scorers array plus loading/error flags for fetch lifecycle.
  let scorers = [];
  let loading = true;
  let error = null;

  // Load cumulative top scorers across all seasons (2022-2025)
  onMount(async () => {
    try {
      scorers = await getCumulativeTopScorers({ league: 39 });
      console.log('Cumulative top scorers loaded:', scorers);
    } catch (err) {
      error = err.message;
      console.error('Error loading cumulative top scorers:', err);
    } finally {
      loading = false; // Stop showing loading state regardless of success/failure.
    }
  });
</script>

<main>
  {#if loading}
    <p>Loading top scorers...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else}
    <!-- Chart section: scatter plot of games played vs goals -->
    <div class="chart-container-top">
      <h2>Games Played vs Goals</h2>
      <p>Bubblechart showing the relationship between games played and goals scored by top players in the current Premier League season. This visualization helps identify the most consistent goal scorers. </p>
      <Bar />
    </div>

    <!-- Bottom layout: left = top scorers list; right = recent fixtures -->
    <div class="container-bottom">
      <div class="scorers-container">
        <h2>Top 10 Goal Scorers Since Erling Haaland Joined</h2>
        <div class="players-list">
          {#each scorers as player (player.lastname)}
            <div class="player-card compact">
              {#if player.photo}
                <img src={player.photo} alt={player.lastname} class="player-photo" />
              {/if}

              <div class="player-info compact-info">
                <div class="player-top">
                  <h3 class="player-name">{player.lastname}</h3>
                  {#if player.logo}
                    <img src={player.logo} alt={player.team} class="team-logo small" />
                  {/if}
                </div>
                <div class="player-goals"> GOALS: {player.goals}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Team goals statistics with season selector -->
      <div class="team-goals-container">
        <TeamGoals />
      </div>
    </div>
  {/if}
</main>