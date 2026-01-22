
// API credentials and endpoints
const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = 'v3.football.api-sports.io';
const BASE_URL = 'https://v3.football.api-sports.io';
const TOPSCORERS_ENDPOINT = `${BASE_URL}/players/topscorers`;
const STANDINGS_ENDPOINT = `${BASE_URL}/standings`;

// Build auth headers for Football API requests.
function buildHeaders() {
  const headers = new Headers();
  headers.append('x-rapidapi-key', API_KEY);
  headers.append('x-rapidapi-host', API_HOST);
  return headers;
}


// Generic GET wrapper returning the API's response array (or []).
async function apiGet(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(),
    redirect: 'follow'
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  return json.response;
}

// Fetch top scorers for a given league & season.
export async function fetchTopScorers({ league = 39, season = 2025 } = {}) {
  try {
    const qs = new URLSearchParams({ league, season });
    const data = await apiGet(`${TOPSCORERS_ENDPOINT}?${qs}`);
    console.log('Top scorers count:', data.length);
    return data;
  } catch (err) {
    console.error('fetchTopScorers error:', err);
    throw err;
  }
}

// Fetch team standings for a league & season
export async function fetchStandings({ league = 39, season = 2025 } = {}) {
  try {
    const qs = new URLSearchParams({ league, season });
    const data = await apiGet(`${STANDINGS_ENDPOINT}?${qs}`);
    console.log('Standings fetched');
    return data;
  } catch (err) {
    console.error('fetchStandings error:', err);
    throw err;
  }
}
