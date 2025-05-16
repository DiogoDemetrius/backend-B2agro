const mongoose = require('mongoose');

const mensagemSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um e-mail válido']
  },
  assunto: {
    type: String,
    required: [true, 'Assunto é obrigatório'],
    trim: true
  },
  mensagem: {
    type: String,
    required: [true, 'Mensagem é obrigatória'],
    trim: true
  },
  aceitePolitica: {
    type: Boolean,
    required: [true, 'É necessário aceitar a política de privacidade'],
    default: false
  },
  dataEnvio: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pendente', 'lida', 'respondida', 'arquivada'],
    default: 'pendente'
  }
}, {
  timestamps: true
});

const Mensagem = mongoose.model('Mensagem', mensagemSchema);

module.exports = Mensagem;
