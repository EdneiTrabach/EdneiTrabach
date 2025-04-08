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
    // Redirecionando para o serviço original do github-readme-stats
    const redirectUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=${layout}&langs_count=${langs_count}&theme=${theme}&hide_border=${hide_border}&locale=${locale}`;
    
    // Obtém os dados do serviço original como redirecionamento
    const response = await axios.get(redirectUrl, {
      responseType: 'arraybuffer'
    });
    
    // Retorna a resposta como SVG
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.send(response.data);
    
  } catch (error) {
    console.error('Error:', error);
    // Em caso de falha, redireciona o cliente para o serviço original
    res.redirect(`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=${layout}&theme=${theme}`);
  }
};
