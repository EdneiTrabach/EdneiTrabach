# API para GitHub Stats

Esta API fornece endpoints que redirecionam para o GitHub Readme Stats e outros serviços de visualização de estatísticas do GitHub.

## Endpoints

### `/api/stats`

Redireciona para o endpoint de estatísticas gerais do GitHub Readme Stats.

Parâmetros:
- `username`: Nome de usuário do GitHub (padrão: EdneiTrabach)
- `theme`: Tema desejado (padrão: prussian)
- `count_private`: Incluir commits privados (padrão: true)
- `hide_border`: Ocultar bordas (padrão: true)
- `locale`: Idioma (padrão: pt-br)

### `/api/top-langs`

Redireciona para o endpoint de linguagens mais usadas do GitHub Readme Stats.

Parâmetros:
- `username`: Nome de usuário do GitHub (padrão: EdneiTrabach)
- `layout`: Formato do layout (padrão: compact)
- `langs_count`: Número de linguagens (padrão: 8)
- `theme`: Tema desejado (padrão: prussian)
- `hide_border`: Ocultar bordas (padrão: true)
- `locale`: Idioma (padrão: pt-br)

## Configuração

Para que a API funcione corretamente, é necessário configurar a variável de ambiente `GITHUB_TOKEN` com um token pessoal do GitHub diretamente no dashboard da Vercel (não no arquivo vercel.json).
