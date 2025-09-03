# 📚 Documentação Completa da API MindTracking
## 🎯 Visão Geral
A **MindTracking API** é uma solução completa para suporte emocional e orientação psicológica, desenvolvida com tecnologias modernas e arquitetura robusta. O sistema oferece questionários diários para acompanhamento emocional, gera diagnósticos personalizados e conta com a **Athena**, uma inteligência artificial especializada em atendimento psicológico.
## 🏗️ Arquitetura da API
### **Estrutura do Projeto**
```
mindtracking-api/
├── config/                 # Configurações (banco, email, IA)
├── controllers/            # Lógica de negócio
├── middlewares/            # Middlewares (autenticação)
├── routes/                 # Definição de rotas
├── templates/              # Templates de email
├── server.js               # Servidor principal
└── package.json            # Dependências e scripts
```
### **Padrão de Arquitetura**
- **MVC (Model-View-Controller)** com separação clara de responsabilidades
- **RESTful API** com endpoints padronizados
- **Middleware de autenticação** para rotas protegidas
- **Configurações centralizadas** para banco, email e IA
## 🛠️ Stack Tecnológica
### **Backend Core**
- **Node.js** (v20+) - Runtime JavaScript assíncrono e orientado a eventos
- **Express.js** (v4.21.2) - Framework web minimalista e flexível
- **ES Modules** - Sistema de módulos nativo do ES6
### **Banco de Dados**
- **PostgreSQL** (v12+) - Banco de dados relacional robusto
- **pg** (v8.13.3) - Driver oficial do PostgreSQL para Node.js
- **Connection Pool** - Gerenciamento eficiente de conexões
### **Autenticação e Segurança**
- **JWT (JSON Web Tokens)** (v9.0.2) - Autenticação stateless
- **bcrypt** (v5.1.1) - Criptografia de senhas com salt
- **dotenv** (v16.4.7) - Gerenciamento seguro de variáveis de ambiente
### **Inteligência Artificial**
- **OpenAI** (v5.12.0) - Integração com API de IA avançada
- **gpt-4o-mini** - Modelo de linguagem para assistência psicológica
- **Contexto de conversa** - Manutenção de histórico para diagnósticos
### **Comunicação e Integração**
- **Nodemailer** (v7.0.3) - Sistema de envio de emails transacional
- **CORS** (v2.8.5) - Cross-origin resource sharing
- **Templates de email** - Sistema personalizado de comunicação
### **Desenvolvimento e DevOps**
- **Nodemon** (v3.1.9) - Hot-reload para desenvolvimento
- **Docker** - Containerização da aplicação
- **Git** - Controle de versão
## 🔐 Sistema de Autenticação
### **Middleware de Autenticação**
```javascript
// middlewares/authenticate.js
export function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token não fornecido' 
        });
    }
    
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token inválido' 
            });
        }
        
        req.user = decoded;
        return next();
    });
}
```
### **Funcionalidades de Segurança**
- **Verificação de email** obrigatória no registro
- **Códigos de verificação** de 4 dígitos enviados por email
- **Recuperação de senha** via email com códigos temporários
- **Criptografia de senhas** com salt de 10 rounds
- **Tokens JWT** com chave secreta configurável
## 📊 Sistema de Questionários
### **Questionário Inicial**
- **Avaliação completa** do perfil emocional do usuário
- **10 perguntas** com alternativas pontuadas (0-4 pontos)
- **Sistema de pontuação** baseado em respostas
- **Classificação emocional** automática
### **Questionários Diários**
- **Monitoramento contínuo** do bem-estar
- **Perguntas aleatórias** selecionadas de um banco de 10+ questões
- **Limite diário** de uma resposta por usuário
- **Análise de tendências** ao longo do tempo
### **Sistema de Pontuação**
- **Cálculo automático** baseado nas alternativas escolhidas
- **Conversão para nota** de 0-10
- **Histórico completo** de pontuações
- **Análise de progresso** emocional
## 🤖 Chatbot Athena - IA Psicológica
### **Configuração da IA**
```javascript
// Configuração do sistema da Athena
const systemPrompt = `Você é Athena, uma assistente psicológica virtual da empresa MindTracking, criada para oferecer suporte emocional e orientação aos usuários que buscam ajuda.
**Limitações e Redirecionamento:**
- Seu único papel é ser uma assistente psicológica
- Redirecione educadamente temas não relacionados ao suporte emocional
- Nunca forneça orientações antiéticas ou socialmente inadequadas
**Diretrizes de Comunicação:**
- Seja carismática, acolhedora e paciente
- Ofereça respostas curtas e objetivas
- Adapte seu tom ao estilo do usuário
- Utilize técnicas de persuasão para autocuidado
**Abordagem Psicológica:**
- Métodos freudianos para reflexão emocional
- Conceitos de Carl Jung (arquétipos e análise da psique)
- Sugestões de práticas terapêuticas
- Redirecionamento para ajuda profissional quando necessário`;
```
### **Funcionalidades da Athena**
- **Suporte emocional 24/7** via chat
- **Contexto de conversa** mantido durante sessões
- **Diagnóstico emocional** após 10 interações
- **Dicas personalizadas** baseadas no perfil do usuário
- **Análise de sentimentos** em tempo real
- **Sugestões de práticas** de bem-estar
### **Modelo de IA Utilizado**
- **gpt-4o-mini** - Modelo otimizado para conversação
- **Temperature: 0.2** - Respostas consistentes e focadas
- **Contexto limitado** para otimização de performance
- **Prompts especializados** para psicologia
## 📝 Sistema de Diário
### **Funcionalidades do Diário**
- **Entradas diárias** com título e texto
- **Análise automática** pela Athena
- **Identificação de emoções** predominantes
- **Avaliação de intensidade** emocional (baixa, moderada, alta)
- **Comentários personalizados** da IA
- **Histórico completo** de reflexões

### **Análise Automática de Texto**
```javascript
// Análise de texto com Athena
export async function analisarTextoComAthena(texto) {
    const prompt = `Analise o seguinte texto e retorne um JSON com:
    1. emocao_predominante: a emoção mais presente
    2. intensidade_emocional: "baixa", "moderada" ou "alta"
    3. comentario_athena: um comentário acolhedor e reflexivo
    
    Texto: "${texto}"`;
    
    // Processamento com OpenAI
    // Retorno estruturado para o banco de dados
}
```
## 🔌 Endpoints da API
### **Base URL**
```
http://localhost:3000
```
## 📋 **FUNÇÕES ESPECÍFICAS POR MÓDULO**
### **🔐 Módulo de Autenticação (authController.js)**
#### **Funções de Registro e Verificação:**
- **`register`** - Cria novo usuário, criptografa senha, gera código de 4 dígitos e envia por email
- **`verifyEmail`** - Valida código de verificação e marca email como verificado
- **`enviarCodigoRecuperacao`** - Gera e envia código temporário para recuperação de senha
#### **Funções de Login e Segurança:**
- **`login`** - Autentica usuário, verifica senha com bcrypt e retorna JWT
- **`verificarCodigoRecuperacao`** - Valida código de recuperação enviado
- **`redefinirSenha`** - Altera senha após validação do código
- **`deleteAccount`** - Remove conta do usuário (requer autenticação)
---
### **🤖 Módulo de Chat (chatController.js)**
#### **Funções de IA e Conversação:**
- **`configChat`** - Configura contexto da conversa e envia para OpenAI GPT-4o-mini
- **`chatHandler`** - Gerencia requisições de chat, valida usuário e retorna respostas da Athena
- **`gerarDicaDiagnostico`** - Gera dicas personalizadas baseadas no histórico do usuário
- **`analisarTextoComAthena`** - Analisa texto do diário e retorna emoção, intensidade e comentário
---
### **📊 Módulo de Questionários (questionarioController.js)**
#### **Funções de Avaliação e Pontuação:**
- **`getPerguntas`** - Retorna perguntas do questionário inicial (ID 1-10) com alternativas
- **`salvarRespostas`** - Salva respostas do usuário e calcula pontuação automática
- **`getPontuacaoUsuario`** - Calcula pontuação total e converte para nota de 0-10
- **`getHistoricoQuestionarios`** - Lista todos os questionários respondidos pelo usuário
#### **Funções de Análise e Estatísticas:**
- **`getEstatisticasUsuario`** - Gera estatísticas detalhadas de respostas e evolução
- **`getCorrelacoesTendencias`** - Analisa padrões e tendências nas respostas usando procedures do banco
---
### **📝 Módulo de Questionários Diários (questionarioDiarioController.js)**
#### **Funções de Monitoramento Contínuo:**
- **`verificarQuestionarioDiario`** - Verifica se usuário já respondeu questionário hoje
- **`getPerguntasDiarias`** - Seleciona 10 perguntas aleatórias (ID >= 11) para questionário diário
- **`salvarRespostasDiarias`** - Salva respostas do questionário diário com validação de data
---
### **📖 Módulo de Diário (diarioController.js)**

#### **Funções de Gestão de Entradas:**
- **`mandarDiario`** - Cria nova entrada, analisa texto com Athena e salva análise automática
- **`buscarDiarios`** - Lista todas as entradas do usuário ordenadas por data
- **`buscarDiarioPorId`** - Busca entrada específica por ID com análise completa
---
### **🔧 Módulo de Configurações**
#### **Banco de Dados (database.js):**
- **`Pool`** - Gerencia conexões PostgreSQL com configurações de ambiente
- **`connect()`** - Estabelece conexão inicial e valida conectividade
#### **Email (emailConfig.js):**
- **`transporter`** - Configura Nodemailer para envio via Gmail com credenciais
#### **IA (IAConfig.js):**
- **`openai`** - Instância configurada da OpenAI com chave API para GPT-4o-mini
---
### **🛡️ Middleware de Autenticação (authenticate.js)**
#### **Função Principal:**
- **`authenticate`** - Valida JWT do header Authorization, decodifica token e adiciona dados do usuário ao `req.user`
---
### **📡 Rotas e Endpoints**
#### **Autenticação (`/auth`):**
- **`POST /register`** → Chama `register()` do authController
- **`POST /login`** → Chama `login()` do authController  
- **`POST /verify-email`** → Chama `verifyEmail()` do authController
- **`POST /recuperar-senha`** → Chama `enviarCodigoRecuperacao()` do authController
- **`POST /verificar-codigo`** → Chama `verificarCodigoRecuperacao()` do authController
- **`POST /redefinir-senha`** → Chama `redefinirSenha()` do authController
- **`DELETE /delete-account`** → Chama `deleteAccount()` do authController (com autenticação)
#### **Chat (`/api`):**
- **`POST /chat`** → Chama `chatHandler()` do chatController (com autenticação)
- **`GET /dica`** → Chama `gerarDicaDiagnostico()` do chatController (com autenticação)
#### **Questionários (`/questionario`):**
- **`GET /perguntas`** → Chama `getPerguntas()` do questionarioController (com autenticação)
- **`POST /responder`** → Chama `salvarRespostas()` do questionarioController (com autenticação)
- **`GET /pontuacao/:id`** → Chama `getPontuacaoUsuario()` do questionarioController (com autenticação)
- **`GET /historico/:id`** → Chama `getHistoricoQuestionarios()` do questionarioController (com autenticação)
- **`GET /estatisticas/:id`** → Chama `getEstatisticasUsuario()` do questionarioController (com autenticação)
- **`GET /correlacoes/:id`** → Chama `getCorrelacoesTendencias()` do questionarioController (com autenticação)
#### **Questionários Diários (`/questionario/diario`):**
- **`GET /verificar/:id`** → Chama `verificarQuestionarioDiario()` do questionarioDiarioController (com autenticação)
- **`GET /perguntas`** → Chama `getPerguntasDiarias()` do questionarioDiarioController (com autenticação)
- **`POST /responder`** → Chama `salvarRespostasDiarias()` do questionarioDiarioController (com autenticação)
#### **Diário (`/api/diario`):**
- **`POST /`** → Chama `mandarDiario()` do diarioController (com autenticação)
- **`GET /`** → Chama `buscarDiarios()` do diarioController (com autenticação)
- **`GET /:id`** → Chama `buscarDiarioPorId()` do diarioController (com autenticação)
---
## 🔍 **FUNCIONAMENTO DETALHADO DE CADA FUNÇÃO**
### **🔐 Módulo de Autenticação (authController.js)**
#### **`register` - Registro de Usuário**
```javascript
// Fluxo interno da função:
1. Valida campos obrigatórios (nome, email, senha, confirmarSenha, data_nascimento)
2. Verifica se senhas coincidem
3. Consulta banco para verificar se email já existe
4. Gera salt com bcrypt.genSalt(10)
5. Criptografa senha com bcrypt.hash(senha, salt)
6. Gera código de verificação de 4 dígitos (Math.random)
7. Envia email via Nodemailer com template personalizado
8. Insere usuário no banco com email_verificado = false
9. Retorna dados do usuário criado (sem senha)
```
#### **`verifyEmail` - Verificação de Email**
```javascript
// Fluxo interno da função:
1. Recebe email e código de verificação
2. Consulta banco para encontrar usuário pelo email
3. Compara código_verificacao com o código recebido
4. Se válido: atualiza email_verificado = true
5. Remove código_verificacao do banco
6. Retorna confirmação de verificação bem-sucedida
```
#### **`login` - Autenticação**
```javascript
// Fluxo interno da função:
1. Recebe email e senha
2. Consulta banco para encontrar usuário pelo email
3. Verifica se email está verificado
4. Compara senha com bcrypt.compare(senha, senhaHash)
5. Se válida: gera JWT com jwt.sign(payload, SECRET_KEY)
6. Retorna token JWT + dados do usuário
```
#### **`enviarCodigoRecuperacao` - Recuperação de Senha**
```javascript
// Fluxo interno da função:
1. Recebe email
2. Verifica se usuário existe no banco
3. Gera novo código de verificação de 4 dígitos
4. Atualiza codigo_verificacao no banco
5. Envia email com código via Nodemailer
6. Retorna confirmação de envio
```
---
### **🤖 Módulo de Chat (chatController.js)**
#### **`configChat` - Configuração de Conversa**
```javascript
// Fluxo interno da função:
1. Valida mensagem recebida
2. Adiciona mensagem do usuário ao array contexto[]
3. Adiciona mensagem ao array mensagensDiagnostico[]
4. Monta prompt com systemPrompt + contexto da conversa
5. Chama OpenAI.chat.completions.create() com:
   - Modelo: gpt-4o-mini
   - Temperature: 0.2
   - Mensagens: system + contexto
6. Extrai resposta da IA
7. Adiciona resposta ao contexto[]
8. Retorna resposta processada
```
#### **`chatHandler` - Gerenciador de Chat**
```javascript
// Fluxo interno da função:
1. Valida mensagem e usuário autenticado
2. Chama configChat(message) para processar com IA
3. Salva interação no banco (opcional)
4. Retorna resposta da Athena
5. Gerencia contexto de conversa para diagnóstico
```
#### **`analisarTextoComAthena` - Análise de Texto**
```javascript
// Fluxo interno da função:
1. Recebe texto do diário
2. Cria prompt específico para análise emocional
3. Chama OpenAI com prompt estruturado
4. Processa resposta JSON da IA:
   - emocao_predominante
   - intensidade_emocional (baixa/moderada/alta)
   - comentario_athena
5. Retorna objeto estruturado para salvar no banco
```
---
### **📊 Módulo de Questionários (questionarioController.js)**
#### **`getPerguntas` - Obtenção de Perguntas**
```javascript
// Fluxo interno da função:
1. Consulta banco para perguntas com ID 1-10 (questionário inicial)
2. Para cada pergunta, busca alternativas relacionadas
3. Monta estrutura JSON:
   {
     id: pergunta.id,
     texto: pergunta.texto,
     alternativas: [
       { id, texto, pontuacao }
     ]
   }
4. Retorna array de perguntas com alternativas
```
#### **`salvarRespostas` - Salvamento de Respostas**
```javascript
// Fluxo interno da função:
1. Valida array de respostas recebido
2. Para cada resposta:
   - Insere na tabela respostas
   - Busca pontuacao da alternativa escolhida
   - Soma pontuação total
3. Atualiza questionario_inicial = true no usuário
4. Calcula pontuação total e nota convertida (0-10)
5. Retorna confirmação com pontuação calculada
```
#### **`getPontuacaoUsuario` - Cálculo de Pontuação**
```javascript
// Fluxo interno da função:
1. Busca usuário pelo ID
2. Executa query SQL:
   SELECT SUM(a.pontuacao) as pontuacao_total,
          COUNT(DISTINCT r.questionario_id) as total_questionarios
   FROM respostas r
   JOIN alternativas a ON r.alternativa_id = a.id
   WHERE r.usuario_id = $1
3. Calcula nota convertida: (pontuacao / pontuacaoMaxima) * 10
4. Retorna pontuação bruta e nota de 0-10
```
#### **`getCorrelacoesTendencias` - Análise de Tendências**
```javascript
// Fluxo interno da função:
1. Valida ID do usuário
2. Chama procedure do banco: analisar_tendencias_respostas($1)
3. Procedure executa análise SQL complexa:
   - Agrupa respostas por padrões
   - Calcula frequência de escolhas
   - Identifica correlações entre perguntas
4. Formata resultado em JSON estruturado
5. Retorna análise de tendências e padrões
```
---
### **📝 Módulo de Questionários Diários (questionarioDiarioController.js)**
#### **`verificarQuestionarioDiario` - Verificação Diária**
```javascript
// Fluxo interno da função:
1. Recebe ID do usuário
2. Executa query SQL:
   SELECT id FROM questionarios 
   WHERE usuario_id = $1 AND data = CURRENT_DATE
3. Se resultado > 0: usuário já respondeu hoje
4. Retorna status: { ja_respondido: true/false }
```
#### **`getPerguntasDiarias` - Seleção de Perguntas**
```javascript
// Fluxo interno da função:
1. Busca todas as perguntas com ID >= 11
2. Agrupa perguntas com alternativas via JOIN
3. Embaralha array com sort(() => Math.random() - 0.5)
4. Seleciona primeiras 10 perguntas embaralhadas
5. Valida se há pelo menos 5 perguntas disponíveis
6. Retorna array de perguntas aleatórias
```
---
### **📖 Módulo de Diário (diarioController.js)**
#### **`mandarDiario` - Criação de Entrada**
```javascript
// Fluxo interno da função:
1. Valida título e texto recebidos
2. Verifica se já existe diário para hoje (DATE(data_hora) = CURRENT_DATE)
3. Insere entrada inicial no banco (sem análise)
4. Chama analisarTextoComAthena(texto) para análise da IA
5. Atualiza entrada com resultados da análise:
   - emocao_predominante
   - intensidade_emocional
   - comentario_athena
6. Retorna entrada completa com análise
```
#### **`buscarDiarios` - Listagem de Entradas**
```javascript
// Fluxo interno da função:
1. Obtém ID do usuário do req.user (JWT decodificado)
2. Executa query SQL:
   SELECT data_hora, titulo, texto, emocao_predominante, 
          intensidade_emocional, comentario_athena
   FROM diario 
   WHERE usuario_id = $1 
   ORDER BY data_hora DESC
3. Retorna array de entradas ordenadas por data
```
---
### **🛡️ Middleware de Autenticação (authenticate.js)**
#### **`authenticate` - Validação JWT**
```javascript
// Fluxo interno da função:
1. Extrai token do header Authorization: "Bearer <token>"
2. Se não houver token: retorna 403 "Token não fornecido"
3. Chama jwt.verify(token, SECRET_KEY, callback)
4. Se token inválido: retorna 401 "Token inválido"
5. Se token válido: adiciona dados decodificados ao req.user
6. Chama next() para continuar para próxima função
```
---
### **🔧 Módulos de Configuração**
#### **Banco de Dados (database.js)**
```javascript
// Funcionamento interno:
1. Importa Pool do pg (PostgreSQL)
2. Cria instância de Pool com variáveis de ambiente:
   - user, host, database, password, port
3. Chama pool.connect() para validar conexão
4. Exporta pool para uso em controllers
5. Gerencia conexões automaticamente (connection pooling)
```
#### **Email (emailConfig.js)**
```javascript
// Funcionamento interno:
1. Importa Nodemailer
2. Cria transporter com configuração Gmail:
   - service: 'gmail'
   - auth: { user, pass } das variáveis de ambiente
3. Exporta transporter para uso em controllers
4. Gerencia envio de emails transacional
```
#### **IA (IAConfig.js)**
```javascript
// Funcionamento interno:
1. Importa OpenAI SDK
2. Carrega API_KEY das variáveis de ambiente
3. Cria instância OpenAI({ apiKey: process.env.API_KEY })
4. Exporta instância para uso em controllers
5. Configura cliente para GPT-4o-mini
```
### **1. Autenticação (`/auth`)**
#### **POST** `/auth/register`
- **Descrição**: Registro de novo usuário
- **Autenticação**: Não requerida
- **Body**:
  ```json
  {
    "nome": "string",
    "email": "string",
    "senha": "string",
    "confirmarSenha": "string",
    "data_nascimento": "YYYY-MM-DD"
  }
  ```
- **Resposta**: Código de verificação enviado por email
- **Status**: 201 (Criado) / 400 (Erro de validação)
#### **POST** `/auth/login`
- **Descrição**: Autenticação do usuário
- **Autenticação**: Não requerida
- **Body**:
  ```json
  {
    "email": "string",
    "senha": "string"
  }
  ```
- **Resposta**: Token JWT para autenticação
- **Status**: 200 (OK) / 401 (Não autorizado)
#### **POST** `/auth/verify-email`
- **Descrição**: Verificação de email com código
- **Autenticação**: Não requerida
- **Body**:
  ```json
  {
    "email": "string",
    "codigo": "string"
  }
  ```
- **Resposta**: Confirmação de verificação
- **Status**: 200 (OK) / 400 (Código inválido)
#### **POST** `/auth/recuperar-senha`
- **Descrição**: Envio de código de recuperação
- **Autenticação**: Não requerida
- **Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Resposta**: Código enviado por email
- **Status**: 200 (OK) / 404 (Email não encontrado)
#### **POST** `/auth/verificar-codigo`
- **Descrição**: Verificação do código de recuperação
- **Autenticação**: Não requerida
- **Body**:
  ```json
  {
    "email": "string",
    "codigo": "string"
  }
  ```
- **Resposta**: Confirmação de código válido
- **Status**: 200 (OK) / 400 (Código inválido)
#### **POST** `/auth/redefinir-senha`
- **Descrição**: Redefinição de senha
- **Autenticação**: Não requerida
- **Body**:
  ```json
  {
    "email": "string",
    "codigo": "string",
    "novaSenha": "string"
  }
  ```
- **Resposta**: Confirmação de alteração
- **Status**: 200 (OK) / 400 (Dados inválidos)
#### **DELETE** `/auth/delete-account`
- **Descrição**: Exclusão de conta
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Resposta**: Confirmação de exclusão
- **Status**: 200 (OK) / 401 (Não autorizado)
### **2. Chat com Athena (`/api`)**
#### **POST** `/api/chat`
- **Descrição**: Interação com o chatbot Athena
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "message": "string"
  }
  ```
- **Resposta**: Resposta da Athena
- **Status**: 200 (OK) / 400 (Mensagem inválida)
#### **GET** `/api/dica`
- **Descrição**: Geração de dica diagnóstica
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Resposta**: Dica personalizada baseada no histórico
- **Status**: 200 (OK) / 401 (Não autorizado)
### **3. Questionários (`/questionario`)**
#### **GET** `/questionario/perguntas`
- **Descrição**: Obtenção de perguntas do questionário inicial
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Resposta**: Lista de perguntas com alternativas
- **Status**: 200 (OK) / 401 (Não autorizado)
#### **POST** `/questionario/responder`
- **Descrição**: Envio de respostas do questionário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "respostas": [
      {
        "pergunta_id": "number",
        "alternativa_id": "number"
      }
    ]
  }
  ```
- **Resposta**: Confirmação de salvamento
- **Status**: 200 (OK) / 400 (Dados inválidos)
#### **GET** `/questionario/pontuacao/:usuario_id`
- **Descrição**: Obtenção da pontuação do usuário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Parâmetros**: `usuario_id` (ID do usuário)
- **Resposta**: Pontuação total e nota convertida
- **Status**: 200 (OK) / 404 (Usuário não encontrado)
#### **GET** `/questionario/historico/:usuario_id`
- **Descrição**: Histórico de questionários respondidos
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Parâmetros**: `usuario_id` (ID do usuário)
- **Resposta**: Lista de questionários com datas
- **Status**: 200 (OK) / 404 (Usuário não encontrado)
#### **GET** `/questionario/estatisticas/:usuario_id`
- **Descrição**: Estatísticas detalhadas do usuário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Parâmetros**: `usuario_id` (ID do usuário)
- **Resposta**: Estatísticas de respostas e evolução
- **Status**: 200 (OK) / 404 (Usuário não encontrado)
#### **GET** `/questionario/correlacoes/:usuario_id`
- **Descrição**: Análise de tendências e correlações
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Parâmetros**: `usuario_id` (ID do usuário)
- **Resposta**: Correlações entre respostas e tendências
- **Status**: 200 (OK) / 404 (Usuário não encontrado)
### **4. Questionários Diários (`/questionario/diario`)**
#### **GET** `/questionario/diario/verificar/:usuario_id`
- **Descrição**: Verificação se usuário já respondeu hoje
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Parâmetros**: `usuario_id` (ID do usuário)
- **Resposta**: Status de resposta diária
- **Status**: 200 (OK) / 404 (Usuário não encontrado)
#### **GET** `/questionario/diario/perguntas`
- **Descrição**: Obtenção de perguntas do questionário diário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Resposta**: Lista de perguntas aleatórias (máx. 10)
- **Status**: 200 (OK) / 404 (Nenhuma pergunta encontrada)
#### **POST** `/questionario/diario/responder`
- **Descrição**: Envio de respostas do questionário diário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "respostas": [
      {
        "pergunta_id": "number",
        "alternativa_id": "number"
      }
    ]
  }
  ```
- **Resposta**: Confirmação de salvamento
- **Status**: 200 (OK) / 400 (Dados inválidos)
### **5. Sistema de Diário (`/api/diario`)**
#### **POST** `/api/diario`
- **Descrição**: Criação de nova entrada no diário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "titulo": "string",
    "texto": "string"
  }
  ```
- **Resposta**: Entrada criada com análise da Athena
- **Status**: 201 (Criado) / 400 (Dados inválidos)
#### **GET** `/api/diario`
- **Descrição**: Busca de todas as entradas do usuário
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Resposta**: Lista de entradas ordenadas por data
- **Status**: 200 (OK) / 401 (Não autorizado)
#### **GET** `/api/diario/:id`
- **Descrição**: Busca de entrada específica por ID
- **Autenticação**: JWT obrigatório
- **Headers**: `Authorization: Bearer <token>`
- **Parâmetros**: `id` (ID da entrada)
- **Resposta**: Entrada específica com análise
- **Status**: 200 (OK) / 404 (Entrada não encontrada)
## 🗄️ Estrutura do Banco de Dados
### **Tabelas Principais**
#### **usuarios**
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `senha` (VARCHAR - criptografada)
- `data_nascimento` (DATE)
- `questionario_inicial` (BOOLEAN)
- `email_verificado` (BOOLEAN)
- `codigo_verificacao` (VARCHAR)
#### **perguntas**
- `id` (SERIAL PRIMARY KEY)
- `texto` (TEXT)
- `tipo` (VARCHAR)
#### **alternativas**
- `id` (SERIAL PRIMARY KEY)
- `pergunta_id` (INTEGER REFERENCES perguntas)
- `texto` (TEXT)
- `pontuacao` (INTEGER)
#### **respostas**
- `id` (SERIAL PRIMARY KEY)
- `usuario_id` (INTEGER REFERENCES usuarios)
- `pergunta_id` (INTEGER REFERENCES perguntas)
- `alternativa_id` (INTEGER REFERENCES alternativas)
- `data_resposta` (TIMESTAMP)
#### **questionarios**
- `id` (SERIAL PRIMARY KEY)
- `usuario_id` (INTEGER REFERENCES usuarios)
- `data` (DATE)
- `tipo` (VARCHAR)
#### **diario**
- `id` (SERIAL PRIMARY KEY)
- `usuario_id` (INTEGER REFERENCES usuarios)
- `titulo` (VARCHAR)
- `texto` (TEXT)
- `data_hora` (TIMESTAMP DEFAULT NOW())
- `emocao_predominante` (VARCHAR)
- `intensidade_emocional` (VARCHAR)
- `comentario_athena` (TEXT)
### **Procedures e Functions**
- `analisar_tendencias_respostas(usuario_id)` - Análise de padrões nas respostas
- Triggers para atualização automática de estatísticas
## 📧 Sistema de Emails
### **Configuração do Nodemailer**
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
```
### **Templates de Email**
- **Verificação de conta** - Código de 4 dígitos
- **Recuperação de senha** - Código temporário
- **Boas-vindas** - Mensagem de acolhimento
- **Notificações** - Lembretes e atualizações
## 🔒 Segurança e Boas Práticas
### **Medidas de Segurança Implementadas**
- **Criptografia de senhas** com bcrypt e salt
- **JWT com chave secreta** configurável
- **Verificação de email** obrigatória
- **Middleware de autenticação** para rotas protegidas
- **Validação de dados** em todas as entradas
- **Sanitização de inputs** para prevenir injeção SQL
- **Variáveis de ambiente** para configurações sensíveis
### **Tratamento de Erros**
- **Logs estruturados** para debugging
- **Mensagens de erro** apropriadas para produção
- **Status HTTP** corretos para cada situação
- **Fallbacks** para operações críticas
## 🚀 Deploy e Configuração
### **Variáveis de Ambiente Necessárias**
```env
# Servidor
PORT=3000
NODE_ENV=development
# Banco de Dados
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres
DB_HOST=localhost
DB_NAME=mindtracking_db
PORTA=5432
# JWT
JWT_KEY=sua_chave_secreta_jwt
# Email
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
# OpenAI
API_KEY=sua_chave_api_openai
```
### **Comandos de Deploy**
```bash
# Instalação de dependências
npm install
# Desenvolvimento
npm start
# Produção
NODE_ENV=production node server.js
# Docker
docker build -t mindtracking-api .
docker run -p 3000:3000 mindtracking-api
```
## 📈 Monitoramento e Performance
### **Métricas de Performance**
- **Response time** das APIs
- **Taxa de sucesso** das operações
- **Uso de memória** e CPU
- **Conexões ativas** com banco de dados
### **Logs e Debugging**
- **Console logs** para desenvolvimento
- **Error tracking** para produção
- **Audit trail** para operações sensíveis
- **Performance monitoring** para otimizações
## 🔮 Funcionalidades Futuras
### **Roadmap de Desenvolvimento**
- **API de relatórios** para profissionais de saúde
- **Integração com wearables** para dados biométricos
- **Sistema de notificações push** para lembretes
- **Analytics avançados** com machine learning
- **API de terceiros** para integração com outras plataformas
- **Sistema de gamificação** para engajamento
- **Chat em tempo real** com WebSockets
## 📞 Suporte e Contato
### **Documentação Adicional**
- **README.md** - Guia de instalação e configuração
- **estrutura.txt** - Visão geral da estrutura do projeto
- **Dockerfile** - Configuração de containerização
### **Contribuição**
- **Issues** para reportar bugs
- **Pull Requests** para contribuições
- **Code review** obrigatório para mudanças
- **Testes** para novas funcionalidades
---
**MindTracking API** - Transformando o cuidado com a saúde mental através de tecnologia inovadora e inteligência artificial especializada.
*Última atualização: Dezembro 2024*