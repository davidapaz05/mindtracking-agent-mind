import openai from "../config/IAconfig.js";
import fs from "fs";
import db from "../config/database.js";

const bdPrompt = fs.readFileSync("./Rag/markdownBD.md", "utf-8");
const backPrompt = fs.readFileSync("./Rag/markdownBack.md", "utf-8");
const frontWebPrompt = fs.readFileSync("./Rag/markdownFrontWeb.md", "utf-8");
const resumoPrompt = fs.readFileSync("./Rag/markdownResumir.md", "utf-8");

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

      return;
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
          content: `Você é um assistente interno da equipe MindTracking, seu nome é Mind, especializado em auxiliar desenvolvedores e QA’s em dúvidas de programação, tecnologia, desenvolvimento de software e também no projeto da plataforma de acompanhamento psicológico MindTracking.

          **Comportamento:**
          - Responda apenas perguntas sobre programação, tecnologia, desenvolvimento de software, frameworks, bancos de dados, testes, boas práticas, debug, arquitetura, integração, APIs, automação, etc., mesmo que não sejam diretamente relacionadas ao MindTracking.
          - Não responda perguntas fora desse escopo. Se a pergunta não for sobre tecnologia, programação ou o projeto MindTracking, responda: "Posso ajudar apenas com dúvidas relacionadas a programação, tecnologia ou ao projeto MindTracking."
          - Seja sempre objetivo e direto em mensagens comuns, evitando rodeios.
          - Quando solicitado para explicar conceitos, resolver problemas técnicos ou gerar código, seja detalhista, explique passo a passo e forneça exemplos claros e completos.
          - Se a dúvida for sobre o projeto MindTracking, utilize os prompts de apoio abaixo para fornecer contexto adicional:
            - Prompt de Banco de Dados: ${bdPrompt}
            - Prompt de Back-End: ${backPrompt}
            - Prompt de Front-End Web: ${frontWebPrompt}
          - Nunca forneça respostas vagas, sem fundamento ou que fujam do objetivo técnico.

          **Exemplos de como agir:**
          - Para perguntas técnicas, responda de forma clara, objetiva e, se necessário, detalhada.
          - Para pedidos de código, explique o raciocínio e forneça o código comentado.
          - Para dúvidas sobre o MindTracking, utilize os prompts de apoio e seja específico sobre o projeto.

          Lembre-se: seu objetivo é ser útil, técnico, objetivo e detalhista quando necessário, sempre focado em programação e tecnologia. Não responda perguntas fora desse objetivo.`
        },
        ...contexto,
        { role: "system", content: contextoExtra }
      ],
      model: "gpt-4o-mini",
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

    let conteudo = respostaIA.choices[0]?.message?.content?.trim();
    if (!conteudo) throw new Error("Resumo vazio");

    // Remove blocos de código markdown, se existirem
    if (conteudo.startsWith("```json")) {
      conteudo = conteudo.replace(/^```json\s*([\s\S]*?)\s*```$/i, "$1").trim();
    } else if (conteudo.startsWith("```")) {
      conteudo = conteudo.replace(/^```\s*([\s\S]*?)\s*```$/i, "$1").trim();
    }

    let resultado;
    try {
      resultado = JSON.parse(conteudo);
    } catch {
      throw new Error("A IA não retornou JSON válido: " + conteudo);
    }

  const [res] = await db.execute(
    `INSERT INTO conversas (resumo, tipo, status) VALUES (?, ?, ?)`,
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
     FROM conversas c
     JOIN conversas_vectores v ON c.id = v.conversa_id
     WHERE c.status = 'resolvido'`
  );

  const scored = rows.map(row => {
    let emb;

    try {
      if (typeof row.embedding === "string") {
        emb = JSON.parse(row.embedding); // se vier string JSON
      } else {
        emb = row.embedding; // se já for array (driver já converteu)
      }
    } catch (err) {
      console.error("Erro ao processar embedding:", row.embedding, err);
      emb = []; // fallback para não quebrar
    }

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