const Newsletter = require('../models/newsletterModel');

/**
 * Service para gerenciamento de assinaturas de newsletter
 */
class NewsletterService {
  /**
   * Cria uma nova assinatura de newsletter
   * @param {Object} newsletterData - Dados da assinatura
   * @returns {Promise<Object>} - Assinatura criada
   */
  async inscrever(newsletterData) {
    try {
      // Verifica se o email já existe
      const emailExistente = await Newsletter.findOne({ email: newsletterData.email });
      
      // Se já existe mas está inativo, reativa
      if (emailExistente && !emailExistente.ativo) {
        emailExistente.ativo = true;
        emailExistente.dataInscricao = Date.now();
        return await emailExistente.save();
      }
      
      // Se já existe e está ativo, retorna erro
      if (emailExistente) {
        throw new Error('Este e-mail já está inscrito na newsletter');
      }
      
      // Cria nova inscrição
      const novaInscricao = new Newsletter(newsletterData);
      return await novaInscricao.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todas as assinaturas com opções de filtro e paginação
   * @param {Object} filtros - Filtros para busca
   * @param {Object} opcoes - Opções de paginação e ordenação
   * @returns {Promise<Array>} - Lista de assinaturas
   */
  async buscarAssinaturas(filtros = {}, opcoes = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sort = { dataInscricao: -1 } 
      } = opcoes;
      
      const skip = (page - 1) * limit;
      
      const assinaturas = await Newsletter.find(filtros)
        .sort(sort)
        .skip(skip)
        .limit(limit);
        
      const total = await Newsletter.countDocuments(filtros);
      
      return {
        assinaturas,
        paginacao: {
          total,
          pagina: page,
          totalPaginas: Math.ceil(total / limit),
          porPagina: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca uma assinatura pelo ID
   * @param {String} id - ID da assinatura
   * @returns {Promise<Object>} - Assinatura encontrada
   */
  async buscarAssinaturaPorId(id) {
    try {
      const assinatura = await Newsletter.findById(id);
      if (!assinatura) {
        throw new Error('Assinatura não encontrada');
      }
      return assinatura;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca uma assinatura pelo email
   * @param {String} email - Email da assinatura
   * @returns {Promise<Object>} - Assinatura encontrada
   */
  async buscarAssinaturaPorEmail(email) {
    try {
      const assinatura = await Newsletter.findOne({ email });
      if (!assinatura) {
        throw new Error('Assinatura não encontrada');
      }
      return assinatura;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza o status de uma assinatura
   * @param {String} id - ID da assinatura
   * @param {Boolean} ativo - Novo status
   * @returns {Promise<Object>} - Assinatura atualizada
   */
  async atualizarStatusAssinatura(id, ativo) {
    try {
      const assinatura = await Newsletter.findByIdAndUpdate(
        id, 
        { ativo }, 
        { new: true, runValidators: true }
      );
      
      if (!assinatura) {
        throw new Error('Assinatura não encontrada');
      }
      
      return assinatura;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancela uma assinatura pelo email
   * @param {String} email - Email da assinatura
   * @returns {Promise<Object>} - Resultado da operação
   */
  async cancelarAssinatura(email) {
    try {
      const assinatura = await Newsletter.findOne({ email });
      
      if (!assinatura) {
        throw new Error('Assinatura não encontrada');
      }
      
      assinatura.ativo = false;
      return await assinatura.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Exclui uma assinatura
   * @param {String} id - ID da assinatura
   * @returns {Promise<Boolean>} - Resultado da operação
   */
  async excluirAssinatura(id) {
    try {
      const resultado = await Newsletter.findByIdAndDelete(id);
      
      if (!resultado) {
        throw new Error('Assinatura não encontrada');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registra envio de newsletter
   * @param {String} id - ID da assinatura
   * @returns {Promise<Object>} - Assinatura atualizada
   */
  async registrarEnvio(id) {
    try {
      const assinatura = await Newsletter.findByIdAndUpdate(
        id, 
        { ultimoEnvio: Date.now() }, 
        { new: true }
      );
      
      if (!assinatura) {
        throw new Error('Assinatura não encontrada');
      }
      
      return assinatura;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca estatísticas de assinaturas
   * @returns {Promise<Object>} - Estatísticas
   */
  async obterEstatisticas() {
    try {
      const total = await Newsletter.countDocuments();
      const ativos = await Newsletter.countDocuments({ ativo: true });
      const inativos = await Newsletter.countDocuments({ ativo: false });
      
      // Estatísticas por categoria
      const geral = await Newsletter.countDocuments({ categoria: 'geral', ativo: true });
      const contabil = await Newsletter.countDocuments({ categoria: 'contabil', ativo: true });
      const rural = await Newsletter.countDocuments({ categoria: 'rural', ativo: true });
      const novidades = await Newsletter.countDocuments({ categoria: 'novidades', ativo: true });
      
      return {
        total,
        ativos,
        inativos,
        categorias: {
          geral,
          contabil,
          rural,
          novidades
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NewsletterService();
