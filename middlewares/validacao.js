const { body, validationResult } = require('express-validator');

/**
 * Middleware para validação de campos da mensagem
 */
const validarMensagem = [
  body('nome')
    .notEmpty().withMessage('Nome é obrigatório')
    .trim(),
  
  body('telefone')
    .notEmpty().withMessage('Telefone é obrigatório')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  
  body('assunto')
    .notEmpty().withMessage('Assunto é obrigatório')
    .trim(),
  
  body('mensagem')
    .notEmpty().withMessage('Mensagem é obrigatória')
    .trim(),
  
  body('aceitePolitica')
    .isBoolean().withMessage('Aceite da política deve ser um booleano')
    .equals('true').withMessage('É necessário aceitar a política de privacidade'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação',
        erros: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware para validação de campos da newsletter
 */
const validarNewsletter = [
  body('email')
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  
  body('categoria')
    .optional()
    .isIn(['geral', 'contabil', 'rural', 'novidades']).withMessage('Categoria inválida'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Erro de validação',
        erros: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validarMensagem,
  validarNewsletter
};
