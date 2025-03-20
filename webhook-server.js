const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Pasta para salvar os dados recebidos
const dataDir = path.join(__dirname, 'webhook-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Endpoint principal para receber os dados do quiz
app.post('/quiz-webhook', (req, res) => {
  try {
    const quizData = req.body;
    console.log('Dados recebidos do quiz:');
    console.log(`Nome: ${quizData.userInfo.name}`);
    console.log(`Email: ${quizData.userInfo.email}`);
    console.log(`Pontuação: ${quizData.quizResults.score}/${quizData.quizResults.totalQuestions} (${quizData.quizResults.percentCorrect}%)`);
    console.log(`Tempo médio de resposta: ${(quizData.quizResults.timing.averageResponseTime / 1000).toFixed(2)}s`);
    
    // Salvar os dados em um arquivo JSON
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `quiz-${quizData.userInfo.name.replace(/\s+/g, '-')}-${timestamp}.json`;
    const filePath = path.join(dataDir, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(quizData, null, 2));
    console.log(`Dados salvos em: ${filePath}`);
    
    res.status(200).json({ success: true, message: 'Dados recebidos com sucesso' });
  } catch (error) {
    console.error('Erro ao processar os dados do webhook:', error);
    res.status(500).json({ success: false, message: 'Erro ao processar os dados' });
  }
});

// Rota para listar todos os resultados salvos
app.get('/quiz-results', (req, res) => {
  try {
    const files = fs.readdirSync(dataDir);
    const results = [];
    
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        results.push({
          fileName: file,
          userInfo: data.userInfo,
          score: data.quizResults.score,
          percentCorrect: data.quizResults.percentCorrect,
          completedAt: data.webhook.timestamp
        });
      }
    });
    
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Erro ao listar resultados:', error);
    res.status(500).json({ success: false, message: 'Erro ao listar resultados' });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor webhook rodando em http://localhost:${PORT}`);
  console.log(`Endpoint para receber dados: http://localhost:${PORT}/quiz-webhook`);
  console.log(`Endpoint para listar resultados: http://localhost:${PORT}/quiz-results`);
}); 