# Desafio Stone Backend

## Tecnologias Utilizadas

- **NestJS**
- **Docker**
- **TypeORM**
- **PostgreSQL**
- **Redis**

## Como Rodar o Projeto

docker-compose up

## Como Parar o Projeto

docker-compose down

## Como Rodar os Testes

npm run test:cov

## Documentação da API

http://localhost:3000/api

## Instruções

Será necessário criar um usuário na rota **POST /starstore/client** e logo depois logar na API na rota **POST /starstore/login** para ter acesso ao JWT para demais requisições.

## PS

O .env está no repositório para facilitar o deploy da aplicação.
Também disponibilizei uma collection do insommia na raiz do projeto para testar as requisições.
