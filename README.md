# As Crônicas das Sombras RPG - Ficha

## Aplicativo Web feito para os jogadores e mestre do RPG ACDS, inspirado por "Ordem Paranormal" de Cellbit.

ACDS RPG foi desenvolvido da seguinte forma:
  - Backend: Node.js com banco de dados MySQL.
  - Frontend: HTML, CSS, Javascript, JQuery e Bootstrap.

Atualmente o projeto está hospedado na Salesforce Heroku para uso pessoal meu e dos meus amigos (e players do meu RPG), portanto, as variáveis de ambiente não vão estar disponíveis para uso.
Na Heroku estou usando os plugins JawsDB for MySQL (para conexão com o banco de dados) e Cloudinary (para repositório de imagens). Fora desse escopo também estou usando a API da Random.org para gerar números aleatórios.

Há uma rota escondida só pra mestres, que é "/register/keeper", onde a chave do mestre é "123456", como definida no banco de dados.
