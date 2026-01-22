import { fetchTopScorers, fetchStandings } from './dataFetch.js';

// Flatten raw player entries into simple objects for UI usage.
export function cleanPlayerData(players) {
  if (!Array.isArray(players)) return [];

  // filter -> map: keep valid entries, then transform
  return players
    .filter((p) => (
      p &&
      p.player && p.player.lastname &&
      p.statistics && p.statistics[0] &&
      p.statistics[0].team && p.statistics[0].team.name
    ))
    .map((p) => ({
      lastname: p.player.lastname,
      team: p.statistics[0].team.name,
      goals: (p.statistics[0].goals && p.statistics[0].goals.total),
      assists: (p.statistics[0].goals && p.statistics[0].goals.assists),
      games: (p.statistics[0].games && p.statistics[0].games.appearences) || 0,
      photo: p.player.photo,
      nationality: p.player.nationality,
      logo: p.statistics[0].team.logo
    }));
}

// Fetch raw top scorers and return cleaned player data.
export async function getCleanedTopScorers({ league = 39, season = 2025 } = {}) {
  try {
    const raw = await fetchTopScorers({ league, season });
    const cleaned = cleanPlayerData(raw);
    console.log('Cleaned players count:', cleaned.length);
    return cleaned.slice(0, 10);
  } catch (err) {
    console.error('getCleanedTopScorers error:', err);
    throw err;
  }
}

// Fetch and aggregate top scorers across multiple seasons (2022-2025)
export async function getCumulativeTopScorers({ league = 39 } = {}) {
  try {
    const seasons = [2022, 2023, 2024, 2025];
    const allPlayers = {};

    // Fetch data for each season
    for (const season of seasons) {
      const raw = await fetchTopScorers({ league, season });
      const cleaned = cleanPlayerData(raw);

      // Aggregate data by player name
      cleaned.forEach(player => {
        if (!allPlayers[player.lastname]) {
          allPlayers[player.lastname] = {
            lastname: player.lastname,
            goals: 0,
            games: 0,
            assists: 0,
            photo: player.photo,
            nationality: player.nationality,
            team: player.team,
            logo: player.logo
          };
        }
        allPlayers[player.lastname].goals += player.goals || 0;
        allPlayers[player.lastname].games += player.games || 0;
        allPlayers[player.lastname].assists += player.assists || 0;
        // Update photo and team to most recent
        allPlayers[player.lastname].photo = player.photo;
        allPlayers[player.lastname].team = player.team;
        allPlayers[player.lastname].logo = player.logo;
      });
    }

    // Convert to array and sort by total goals
    const aggregated = Object.values(allPlayers)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);

    console.log('Cumulative top scorers:', aggregated.length);
    return aggregated;
  } catch (err) {
    console.error('getCumulativeTopScorers error:', err);
    throw err;
  }
}

// Get team statistics: total goals and top scorer percentage
export async function getTeamGoalStats({ league = 39, season = 2025 } = {}) {
  try {
    // Fetch actual team standings for real goal totals
    const standingsData = await fetchStandings({ league, season });
    const standings = standingsData[0]?.league?.standings?.[0] || [];
    
    // Fetch top scorers to get top scorer info
    const raw = await fetchTopScorers({ league, season });
    const cleaned = cleanPlayerData(raw);
    
    // Build team stats from standings
    const teamStats = {};
    
    standings.forEach(standing => {
      const teamName = standing.team.name;
      teamStats[teamName] = {
        team: teamName,
        logo: standing.team.logo,
        totalGoals: standing.all.goals.for,
        topScorer: null,
        topScorerGoals: 0
      };
    });
    
    // Find top scorer for each team
    cleaned.forEach(player => {
      if (teamStats[player.team]) {
        if ((player.goals || 0) > teamStats[player.team].topScorerGoals) {
          teamStats[player.team].topScorerGoals = player.goals || 0;
          teamStats[player.team].topScorer = player.lastname;
        }
      }
    });

    // Calculate percentage and convert to array
    const teams = Object.values(teamStats)
      .map(team => ({
        ...team,
        topScorerPercentage: team.totalGoals > 0 
          ? ((team.topScorerGoals / team.totalGoals) * 100).toFixed(1)
          : 0
      }))
      .sort((a, b) => b.totalGoals - a.totalGoals);

    console.log('Team stats count:', teams.length);
    return teams;
  } catch (err) {
    console.error('getTeamGoalStats error:', err);
    throw err;
  }
}
