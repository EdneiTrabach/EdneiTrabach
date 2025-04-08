const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  const { 
    username = 'EdneiTrabach', 
    layout = 'compact', 
    langs_count = 8,
    theme = 'prussian', 
    hide_border = true, 
    locale = 'pt-br' 
  } = req.query;
  
  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const reposResponse = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`, 
      { headers }
    );
    const repos = reposResponse.data;
    
    // Coletar dados de linguagens
    const languages = {};
    for (const repo of repos) {
      if (repo.fork) continue; // Ignorar forks
      
      try {
        const langsResponse = await axios.get(repo.languages_url, { headers });
        const repoLangs = langsResponse.data;
        
        for (const [lang, bytes] of Object.entries(repoLangs)) {
          languages[lang] = (languages[lang] || 0) + bytes;
        }
      } catch (error) {
        console.error(`Failed to get languages for ${repo.name}`, error);
      }
    }
    
    // Ordenar e limitar linguagens
    const sortedLangs = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, Number(langs_count));
    
    // Gerar SVG
    const svgOutput = generateLangsSVG(sortedLangs, theme, layout, hide_border, locale);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.send(svgOutput);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error generating top languages');
  }
};

function generateLangsSVG(languages, theme, layout, hide_border, locale) {
  // Implementação básica - na prática seria melhor redirecionar para o serviço original
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
  
  // Calcula total de bytes para percentual
  const totalBytes = languages.reduce((sum, [_, bytes]) => sum + bytes, 0);
  
  // Gera barras para cada linguagem
  let langBars = '';
  let langLabels = '';
  
  languages.forEach(([lang, bytes], index) => {
    const percentage = ((bytes / totalBytes) * 100).toFixed(2);
    const y = 55 + (index * 25);
    
    // Códigos de cores para linguagens populares
    const langColors = {
      "JavaScript": "#f1e05a",
      "Python": "#3572A5",
      "Java": "#b07219",
      "TypeScript": "#2b7489",
      "HTML": "#e34c26",
      "CSS": "#563d7c",
      "PHP": "#4F5D95",
      "C#": "#178600",
      "C++": "#f34b7d",
      "Shell": "#89e051"
    };
    
    const langColor = langColors[lang] || "#858585";
    
    langBars += `
      <rect x="25" y="${y}" width="${percentage * 3}" height="20" fill="${langColor}" rx="5" />
    `;
    
    langLabels += `
      <text x="25" y="${y - 5}" class="lang">${lang}</text>
      <text x="${(percentage * 3) + 35}" y="${y + 15}" class="percentage">${percentage}%</text>
    `;
  });
  
  return `
  <svg width="350" height="${languages.length * 25 + 70}" viewBox="0 0 350 ${languages.length * 25 + 70}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .header { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${color.title}; }
      .lang { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${color.text}; }
      .percentage { font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${color.text}; }
    </style>
    
    <rect x="0.5" y="0.5" width="349" height="${languages.length * 25 + 69}" rx="4.5" fill="${color.bg}" stroke="${color.border}" stroke-width="1" />
    
    <text x="25" y="35" class="header">Linguagens Mais Usadas</text>
    
    ${langBars}
    ${langLabels}
  </svg>
  `;
}
