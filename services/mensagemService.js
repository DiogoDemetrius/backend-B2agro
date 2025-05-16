const Mensagem = require('../models/mensagemModel');

/**
 * Service para gerenciamento de mensagens
 */
class MensagemService {
  /**
   * Cria uma nova mensagem
   * @param {Object} mensagemData - Dados da mensagem
   * @returns {Promise<Object>} - Mensagem criada
   */
  async criarMensagem(mensagemData) {
    try {
      // Validação adicional para garantir que a política foi aceita
      if (!mensagemData.aceitePolitica) {
        throw new Error('É necessário aceitar a política de privacidade');
      }
      
      const novaMensagem = new Mensagem(mensagemData);
      return await novaMensagem.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todas as mensagens com opções de filtro e paginação
   * @param {Object} filtros - Filtros para busca
   * @param {Object} opcoes - Opções de paginação e ordenação
   * @returns {Promise<Array>} - Lista de mensagens
   */
  async buscarMensagens(filtros = {}, opcoes = {}) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sort = { dataEnvio: -1 } 
      } = opcoes;
      
      const skip = (page - 1) * limit;
      
      const mensagens = await Mensagem.find(filtros)
        .sort(sort)
        .skip(skip)
        .limit(limit);
        
      const total = await Mensagem.countDocuments(filtros);
      
      return {
        mensagens,
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
   * Busca uma mensagem pelo ID
   * @param {String} id - ID da mensagem
   * @returns {Promise<Object>} - Mensagem encontrada
   */
  async buscarMensagemPorId(id) {
    try {
      const mensagem = await Mensagem.findById(id);
      if (!mensagem) {
        throw new Error('Mensagem não encontrada');
      }
      return mensagem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza o status de uma mensagem
   * @param {String} id - ID da mensagem
   * @param {String} status - Novo status
   * @returns {Promise<Object>} - Mensagem atualizada
   */
  async atualizarStatusMensagem(id, status) {
    try {
      const statusPermitidos = ['pendente', 'lida', 'respondida', 'arquivada'];
      
      if (!statusPermitidos.includes(status)) {
        throw new Error(`Status inválido. Valores permitidos: ${statusPermitidos.join(', ')}`);
      }
      
      const mensagem = await Mensagem.findByIdAndUpdate(
        id, 
        { status }, 
        { new: true, runValidators: true }
      );
      
      if (!mensagem) {
        throw new Error('Mensagem não encontrada');
      }
      
      return mensagem;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Exclui uma mensagem
   * @param {String} id - ID da mensagem
   * @returns {Promise<Boolean>} - Resultado da operação
   */
  async excluirMensagem(id) {
    try {
      const resultado = await Mensagem.findByIdAndDelete(id);
      
      if (!resultado) {
        throw new Error('Mensagem não encontrada');
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca estatísticas de mensagens
   * @returns {Promise<Object>} - Estatísticas
   */
  async obterEstatisticas() {
    try {
      const total = await Mensagem.countDocuments();
      const pendentes = await Mensagem.countDocuments({ status: 'pendente' });
      const lidas = await Mensagem.countDocuments({ status: 'lida' });
      const respondidas = await Mensagem.countDocuments({ status: 'respondida' });
      const arquivadas = await Mensagem.countDocuments({ status: 'arquivada' });
      
      return {
        total,
        pendentes,
        lidas,
        respondidas,
        arquivadas
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new MensagemService();
