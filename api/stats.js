const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  const { username = 'EdneiTrabach', theme = 'prussian', count_private = true, hide_border = true, locale = 'pt-br' } = req.query;
  
  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const response = await axios.get(`https://api.github.com/users/${username}`, { headers });
    const user = response.data;
    
    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    const repos = reposResponse.data;
    
    const stats = {
      name: user.name || username,
      totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
      totalCommits: 0,
      totalIssues: 0,
      totalPRs: 0,
      contributedTo: 0,
      repos: repos.length
    };
    
    // Formatar resultado SVG
    const svgOutput = generateStatsSVG(stats, theme, hide_border, locale);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.send(svgOutput);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating stats');
  }
};

function generateStatsSVG(stats, theme, hide_border, locale) {
  // Implementação básica - na prática seria melhor redirecionar para o serviço original
  // ou usar uma biblioteca para gerar SVG
  const colors = {
    prussian: {
      bg: "#172f45",
      text: "#ffffff",
      title: "#64ffda",
      icon: "#79c0ff",
      border: hide_border ? "none" : "#0d1117"
    }
  };
  
  const color = colors[theme] || colors.prussian;
  
  return `
  <svg width="495" height="195" viewBox="0 0 495 195" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${color.title}; }
      .stat { font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${color.text}; }
      .stagger { opacity: 0; animation: fadeInAnimation 0.3s ease-in-out forwards; }
      .rank-text { font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${color.text}; }
      
      /* Animations */
      @keyframes fadeInAnimation {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    </style>
    
    <rect x="0.5" y="0.5" width="494" height="99%" rx="4.5" fill="${color.bg}" stroke="${color.border}" stroke-width="1" />
    
    <text x="25" y="35" class="header">${stats.name} GitHub Stats</text>
    
    <text x="25" y="70" class="stat">Total Repos: ${stats.repos}</text>
    <text x="25" y="95" class="stat">Total Estrelas: ${stats.totalStars}</text>
    <text x="25" y="120" class="stat">Contribuições: ${stats.contributedTo}</text>
    
    <text x="250" y="70" class="stat">Total PRs: ${stats.totalPRs}</text>
    <text x="250" y="95" class="stat">Total Issues: ${stats.totalIssues}</text>
  </svg>
  `;
}
