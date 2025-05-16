const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { validarNewsletter } = require('../middlewares/validacao');

// Rota para criar uma nova assinatura
router.post('/', validarNewsletter, newsletterController.inscrever);

// Rota para buscar todas as assinaturas
router.get('/', newsletterController.buscarAssinaturas);

// Rota para buscar estatísticas
router.get('/estatisticas', newsletterController.obterEstatisticas);

// Rota para verificar se um email está inscrito
router.get('/verificar/:email', newsletterController.verificarInscricao);

// Rota para buscar uma assinatura específica
router.get('/:id', newsletterController.buscarAssinaturaPorId);

// Rota para atualizar o status de uma assinatura
router.patch('/:id/status', newsletterController.atualizarStatusAssinatura);

// Rota para cancelar uma assinatura pelo email
router.delete('/cancelar/:email', newsletterController.cancelarAssinatura);

// Rota para excluir uma assinatura
router.delete('/:id', newsletterController.excluirAssinatura);

module.exports = router;
