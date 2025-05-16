const newsletterService = require('../services/newsletterService');

/**
 * Controller para gerenciamento de assinaturas de newsletter
 */
class NewsletterController {
  /**
   * Cria uma nova assinatura de newsletter
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async inscrever(req, res) {
    try {
      const { email, categoria = 'geral' } = req.body;
      
      if (!email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'E-mail é obrigatório'
        });
      }
      
      const novaAssinatura = await newsletterService.inscrever({ email, categoria });
      
      res.status(201).json({
        sucesso: true,
        mensagem: 'Inscrição realizada com sucesso',
        data: novaAssinatura
      });
    } catch (error) {
      res.status(400).json({
        sucesso: false,
        mensagem: error.message || 'Erro ao realizar inscrição',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Busca todas as assinaturas com filtros e paginação
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async buscarAssinaturas(req, res) {
    try {
      // Extrai parâmetros de consulta
      const { page, limit, ativo, categoria } = req.query;
      
      // Constrói filtros
      const filtros = {};
      if (ativo !== undefined) filtros.ativo = ativo === 'true';
      if (categoria) filtros.categoria = categoria;
      
      // Constrói opções
      const opcoes = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };
      
      const resultado = await newsletterService.buscarAssinaturas(filtros, opcoes);
      
      res.status(200).json({
        sucesso: true,
        data: resultado.assinaturas,
        paginacao: resultado.paginacao
      });
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar assinaturas',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Busca uma assinatura pelo ID
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async buscarAssinaturaPorId(req, res) {
    try {
      const { id } = req.params;
      const assinatura = await newsletterService.buscarAssinaturaPorId(id);
      
      res.status(200).json({
        sucesso: true,
        data: assinatura
      });
    } catch (error) {
      res.status(404).json({
        sucesso: false,
        mensagem: error.message || 'Assinatura não encontrada',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Verifica se um email está inscrito
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async verificarInscricao(req, res) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'E-mail é obrigatório'
        });
      }
      
      try {
        const assinatura = await newsletterService.buscarAssinaturaPorEmail(email);
        
        res.status(200).json({
          sucesso: true,
          inscrito: true,
          ativo: assinatura.ativo,
          data: assinatura
        });
      } catch (error) {
        // Se não encontrar, não é um erro, apenas não está inscrito
        res.status(200).json({
          sucesso: true,
          inscrito: false
        });
      }
    } catch (error) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao verificar inscrição',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Atualiza o status de uma assinatura
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async atualizarStatusAssinatura(req, res) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;
      
      if (ativo === undefined) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Status (ativo) é obrigatório'
        });
      }
      
      const assinaturaAtualizada = await newsletterService.atualizarStatusAssinatura(id, ativo);
      
      res.status(200).json({
        sucesso: true,
        mensagem: ativo ? 'Assinatura ativada com sucesso' : 'Assinatura desativada com sucesso',
        data: assinaturaAtualizada
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
   * Cancela uma assinatura pelo email
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async cancelarAssinatura(req, res) {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'E-mail é obrigatório'
        });
      }
      
      await newsletterService.cancelarAssinatura(email);
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'Assinatura cancelada com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        sucesso: false,
        mensagem: error.message || 'Erro ao cancelar assinatura',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Exclui uma assinatura
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async excluirAssinatura(req, res) {
    try {
      const { id } = req.params;
      await newsletterService.excluirAssinatura(id);
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'Assinatura excluída com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        sucesso: false,
        mensagem: error.message || 'Erro ao excluir assinatura',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  }

  /**
   * Busca estatísticas de assinaturas
   * @param {Object} req - Requisição Express
   * @param {Object} res - Resposta Express
   */
  async obterEstatisticas(req, res) {
    try {
      const estatisticas = await newsletterService.obterEstatisticas();
      
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

module.exports = new NewsletterController();
