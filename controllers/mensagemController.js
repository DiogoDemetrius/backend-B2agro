const mensagemService = require('../services/mensagemService');

/**
 * Controller para gerenciamento de mensagens
 */
class MensagemController {
  /**
   * Cria uma nova mensagem
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async criarMensagem(req, res) {
    try {
      const mensagemData = req.body;
      const novaMensagem = await mensagemService.criarMensagem(mensagemData);
      
      res.status(201).json({
        sucesso: true,
        mensagem: 'Mensagem enviada com sucesso',
        data: novaMensagem
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error.message || 'Erro ao enviar mensagem',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Busca todas as mensagens com filtros e paginação
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async buscarMensagens(req, res) {
    try {
      // Extrai parâmetros de consulta
      const { page, limit, status } = req.query;
      
      // Constrói filtros
      const filtros = {};
      if (status) filtros.status = status;
      
      // Constrói opções
      const opcoes = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };
      
      const resultado = await mensagemService.buscarMensagens(filtros, opcoes);
      
      res.status(200).json({
        sucesso: true,
        data: resultado.mensagens,
        paginacao: resultado.paginacao
      });
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar mensagens',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Busca uma mensagem pelo ID
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async buscarMensagemPorId(req, res) {
    try {
      const { id } = req.params;
      const mensagem = await mensagemService.buscarMensagemPorId(id);
      
      res.status(200).json({
        sucesso: true,
        data: mensagem
      });
    } catch (error) {
      res.status(404).json({
        sucesso: false,
        mensagem: error.message || 'Mensagem não encontrada',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Atualiza o status de uma mensagem
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async atualizarStatusMensagem(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Status é obrigatório'
        });
      }
      
      const mensagemAtualizada = await mensagemService.atualizarStatusMensagem(id, status);
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'Status atualizado com sucesso',
        data: mensagemAtualizada
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error.message || 'Erro ao atualizar status',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Exclui uma mensagem
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async excluirMensagem(req, res) {
    try {
      const { id } = req.params;
      await mensagemService.excluirMensagem(id);
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'Mensagem excluída com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        sucesso: false,
        mensagem: error.message || 'Erro ao excluir mensagem',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Busca estatísticas de mensagens
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async obterEstatisticas(req, res) {
    try {
      const estatisticas = await mensagemService.obterEstatisticas();
      
      res.status(200).json({
        sucesso: true,
        data: estatisticas
      });
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao obter estatísticas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new MensagemController();
