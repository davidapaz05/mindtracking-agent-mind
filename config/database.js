// Importa o pacote 'pg' (PostgreSQL) para interagir com o banco de dados
import mysql from 'mysql2/promise';
// Importa o pacote 'dotenv' para carregar variáveis de ambiente de um arquivo .env
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();
// Cria uma nova instância de Pool para gerenciar conexões com o banco de dados
const banco = await mysql.createConnection({
    user: process.env.DB_USER, // Usuário do banco de dados (definido no .env)
    host: process.env.DB_HOST, // Host do banco de dados (definido no .env)
    database: process.env.DB_NAME, // Nome do banco de dados (definido no .env)
    password: process.env.DB_PASSWORD, // Senha do banco de dados (definido no .env)
});

banco.connect()
    .then(() => console.log("Banco de dados conectado!")) // Mensagem de sucesso ao conectar
    .catch(err => console.error("Erro ao conectar ao banco:", err)); // Mensagem de erro caso a conexão falhe

export default banco;