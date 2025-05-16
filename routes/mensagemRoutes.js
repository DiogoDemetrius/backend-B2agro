const express = require('express');
const router = express.Router();
const mensagemController = require('../controllers/mensagemController');
const { validarMensagem } = require('../middlewares/validacao');

// Rota para criar uma nova mensagem
router.post('/', validarMensagem, mensagemController.criarMensagem);

// Rota para buscar todas as mensagens
router.get('/', mensagemController.buscarMensagens);

// Rota para buscar estatísticas
router.get('/estatisticas', mensagemController.obterEstatisticas);

// Rota para buscar uma mensagem específica
router.get('/:id', mensagemController.buscarMensagemPorId);

// Rota para atualizar o status de uma mensagem
router.patch('/:id/status', mensagemController.atualizarStatusMensagem);

// Rota para excluir uma mensagem
router.delete('/:id', mensagemController.excluirMensagem);

module.exports = router;
