import openai from "../config/IAconfig.js";
import fs from "fs";
import db from "../config/database.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bdPrompt = fs.readFileSync(path.join(__dirname, '../Rag/markdownBD.md'), "utf-8");
const backPrompt = fs.readFileSync(path.join(__dirname, '../Rag/markdownBack.md'), "utf-8");
const resumoPrompt = fs.readFileSync(path.join(__dirname, '../Rag/markdownResumir.md'), "utf-8");

let contexto = [];

// ============================
// Chat principal
// ============================
export async function chat(message) {
  try {
    if (!message || typeof message !== "string") {
      throw new Error("Mensagem inválida ou vazia");
    }

    // Se o usuário digitar "fim de chat"
    if (message.toLowerCase().trim() === "fim de chat") {
      if (contexto.length === 0) {
        return "Nenhuma conversa registrada para resumir.";
      }

      // Concatena o contexto em texto
      const conversaCompleta = contexto
        .map(c => `${c.role.toUpperCase()}: ${c.content}`)
        .join("\n");

      // Envia para a IA de resumo
      const resumo = await resumirConversa(conversaCompleta);

      // Salva embedding dessa conversa resumida
      await salvarEmbedding(resumo.id, resumo.resumo);

      // Zera o contexto
      contexto = [];

      return `Conversa encerrada. Resumo salvo no banco: ${JSON.stringify(resumo)}`;
    }

    // Adiciona a mensagem do usuário ao contexto da conversa
    contexto.push({ role: "user", content: message });

    // Buscar conversas semelhantes resolvidas
    const semelhantes = await buscarConversasSemelhantes(message);

    let contextoExtra = "";
    if (semelhantes.length > 0) {
      contextoExtra = "Aqui estão problemas semelhantes já resolvidos:\n\n";
      semelhantes.forEach((conv, i) => {
        contextoExtra += `(${i + 1}) ${conv.resumo}\n\n`;
      });
    }

    // Envia a mensagem para a API IA com diretrizes + contexto semelhante
    const respostaIA = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um assistente interno da equipe MindTracking,seu nome é Mind especializado em auxiliar desenvolvedores e QA’s no projeto da plataforma de acompanhamento psicológico. 
          A plataforma utiliza questionários diários, diários escritos e interações com a Athena (IA de apoio psicológico) para gerar dados que o usuário pode exportar ou visualizar para melhorar sua saúde mental.  
                                          
          Suas responsabilidades:
                        
          **Limitações e Redirecionamento:**  
          - Seu único papel é ser uma assistente para os desenvolvedores da equipe. Se perguntarem sobre outros temas, redirecione a conversa educadamente para o foco do suporte emocional.
          - Você não deve mandar nada que não seja sobre assistência, resolução de problemas, orientações relacionadas ao projeto em nível técnico ou para criação de conteúdo relacionado ao projeto.
          - Você não ensina nada que não seja a sua função ou que não seja relacionado a suas outras orientações, suas orientações se limitam a Desenvolvimento BackEnd, Banco de dados, Programação FrontEnd, Orientações sobre o projeto, testes de eficiência e ajudas para QA ou relacionadas.                    
          - Se o usuário perguntar se você pode machucá-lo ou causar dano a ele ou a outras pessoas, responda de maneira criativa e reconfortante, deixando claro que sua missão é apoiar e promover o bem-estar.  
          - Nunca forneça orientações sem fundamento ou sem sentido/vagas.  
          - Se te pedirem para fazer algo que não seja relacionado ao seu objetivo não faça.

          **O que você deve auxiliar o usuario:**
                  1. Desenvolvimento Back-End e Banco de Dados
                  - Auxiliar com dúvidas técnicas de back-end e banco de dados.
                  - Explicar soluções de forma clara, concisa e técnica, sem respostas vagas.
                  - Você terá acesso aos seguintes prompts de apoio:
                    - Prompt de Banco de Dados: ${bdPrompt}
                    - Prompt de Back-End: ${backPrompt}
                  - Sempre quando te apresentado um erro de codigo utilize a base de dados para verificar onde pode estar o erro.
                                          
                  2. Testes Automatizados (QA)
                  - Ajudar a equipe de QA a criar testes automatizados para as funcionalidades da plataforma.
                  - Ensinar como forçar bugs, realizar testes brutos e gerar erros de forma controlada para fortalecer a aplicação.
                                          
                  3. Escopo de Resposta
                  - Responder somente a perguntas relacionadas ao projeto MindTracking.
                  - Se a pergunta for fora desse contexto, responda educadamente:
                    "Posso ajudar apenas com dúvidas relacionadas ao desenvolvimento ou testes da plataforma MindTracking."`
        },
        ...contexto,
        { role: "system", content: contextoExtra }
      ],
      model: "gpt-5",
      temperature: 0.7
    });

    const resposta = respostaIA.choices[0]?.message?.content?.trim();

    if (!resposta) {
      throw new Error("Não foi possível gerar uma resposta");
    }

    // Adiciona a resposta ao contexto da conversa
    contexto.push({ role: "assistant", content: resposta });

    return resposta;
  } catch (error) {
    console.error("Erro ao configurar chat:", error);
    throw new Error("Não foi possível processar sua mensagem. Por favor, tente novamente mais tarde.");
  }
}

// ============================
// Função de resumo e inserção no banco
// ============================
async function resumirConversa(conversa) {
  const respostaIA = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: resumoPrompt },
      { role: "user", content: conversa }
    ]
  });

  const conteudo = respostaIA.choices[0]?.message?.content?.trim();
  if (!conteudo) throw new Error("Resumo vazio");

  let resultado;
  try {
    resultado = JSON.parse(conteudo);
  } catch {
    throw new Error("A IA não retornou JSON válido: " + conteudo);
  }

  const [res] = await db.execute(
    `INSERT INTO conversas_resumidas (resumo, tipo, status) VALUES (?, ?, ?)`,
    [resultado.resumo, resultado.tipo, resultado.status]
  );

  return { id: res.insertId, ...resultado };
}
// ============================
// Embeddings
// ============================
async function salvarEmbedding(conversaId, texto) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texto
  });

  const embedding = response.data[0].embedding;
  await db.execute(
    `INSERT INTO conversas_vectores (conversa_id, embedding) VALUES (?, ?)`,
    [conversaId, JSON.stringify(embedding)]
  );
}

async function gerarEmbedding(texto) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texto
  });
  return response.data[0].embedding;
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((acc, v, i) => acc + v * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((acc, v) => acc + v * v, 0));
  const normB = Math.sqrt(vecB.reduce((acc, v) => acc + v * v, 0));
  return dot / (normA * normB);
}

async function buscarConversasSemelhantes(problema) {
  const queryEmbedding = await gerarEmbedding(problema);

  const [rows] = await db.execute(
    `SELECT c.id, c.resumo, c.tipo, c.status, v.embedding
     FROM conversas_resumidas c
     JOIN conversas_vectores v ON c.id = v.conversa_id
     WHERE c.status = 'resolvido'`
  );

  const scored = rows.map(row => {
    const emb = JSON.parse(row.embedding);
    return {
      id: row.id,
      resumo: row.resumo,
      tipo: row.tipo,
      status: row.status,
      score: cosineSimilarity(queryEmbedding, emb)
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}
