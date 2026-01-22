# The Best Premier League Attacker

Welcome to my repository tracking the best Premier League attacker for the 2025/2026 season. This is the data visualization I built for the Minor Information Design at the HVA.

## 🔴 Live Demo

**[View Live App on Vercel](https://tech-track-herkansing.vercel.app)**

## About This Data Visualization

I'm someone who is very interested in football and I like watching player statistics. What especially fascinates me is statistical outliers. That's why I made this data visualization where you can follow Erling Haaland all year to see how far ahead he is of the rest of the Premier League attackers. 

The data I used includes goals and games played. These statistics are shown in a bubble chart with the top 10 Premier League attackers based on their amount of goals.

I also made a simple list with the players and their goal counts underneath the visualization so you can identify who is who, because sometimes players overlap in the chart.



## 🛠️ Built With

- **SvelteKit** - Web framework
- **D3.js** - Data visualization
- **Vite** - Build tool
- **API-Football** - Real-time football data
- **Vercel** - Hosting and deployment

## 📦 Installation Guide

### Prerequisites

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/).

### Clone the Repository

```bash
git clone https://github.com/christiandewith/tech-track-herkansing.git
cd tech-track-herkansing
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add your API key:

```
VITE_API_KEY=your_api_key_here
```

Get your API key from [RapidAPI - API-Football](https://rapidapi.com/api-sports/api/api-football).

### Run Development Server

```bash
npm run dev
```

Open the localhost URL shown in your terminal (usually `http://localhost:5173`) to view the project.




