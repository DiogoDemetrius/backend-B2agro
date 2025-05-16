const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, forneça um e-mail válido']
  },
  ativo: {
    type: Boolean,
    default: true
  },
  dataInscricao: {
    type: Date,
    default: Date.now
  },
  ultimoEnvio: {
    type: Date,
    default: null
  },
  categoria: {
    type: String,
    default: 'geral',
    enum: ['geral', 'contabil', 'rural', 'novidades']
  }
}, {
  timestamps: true
});

// Índice para melhorar a performance de buscas por email
newsletterSchema.index({ email: 1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
