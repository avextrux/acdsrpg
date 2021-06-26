# As Crônicas das Sombras RPG - Ficha

## Aplicativo Web feito para os jogadores e mestre do RPG ACDS, inspirado por "Ordem Paranormal" de Cellbit.

ACDS RPG foi desenvolvido da seguinte forma:
  - Backend: Node.js com banco de dados MySQL.
  - Frontend: HTML, CSS, Javascript, JQuery e Bootstrap.

Atualmente o projeto está hospedado na Salesforce Heroku para uso pessoal meu e dos meus amigos (e players do meu RPG), portanto, as variáveis de ambiente não vão estar disponíveis para uso.
Na Heroku estou usando os plugins JawsDB for MySQL (para conexão com o banco de dados) e Cloudinary (para repositório de imagens). Fora desse escopo também estou usando a API da Random.org para gerar números aleatórios.

O SQL para criar o banco de dados está nomeado como "create database.sql", e pode ser tanto executado como importado pra criar o ambiente.

Há uma rota escondida só pra mestres, que é "/register/keeper", onde a chave do mestre é "123456", como definida no banco de dados.

## Imagens

Ficha do Jogador
![image](https://user-images.githubusercontent.com/71353674/123519169-0dc36800-d680-11eb-9ce7-4b7e235bd30c.png)
![image](https://user-images.githubusercontent.com/71353674/123519192-29c70980-d680-11eb-965b-501b226d1614.png)
![image](https://user-images.githubusercontent.com/71353674/123519198-3186ae00-d680-11eb-9d8e-e0b7b84e4b8d.png)
![image](https://user-images.githubusercontent.com/71353674/123519220-51b66d00-d680-11eb-9d7c-5af01460aaa3.png)

Ficha do Mestre
![image](https://user-images.githubusercontent.com/71353674/123519203-3b101600-d680-11eb-9977-ac1d13ed4b13.png)
