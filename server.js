require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const mensagemRoutes = require('./routes/mensagemRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');

const app = express();

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conexão com MongoDB estabelecida com sucesso');
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
  process.exit(1);
});

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rotas
app.use('/api/mensagens', mensagemRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Rota de status
app.get('/api/health', (req, res) => {
  res.json({
    mensagem: 'API de Mensagens e Newsletter',
    status: 'online',
    versao: '1.0.0'
  });
});

// Rota raiz opcional
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    sucesso: false,
    mensagem: err.message || 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// Escutar na porta definida pelo ambiente (Render, Heroku, etc) ou 5000 localmente
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
});

// Exporta o app caso queira importar em testes ou serverless
module.exports = app;
