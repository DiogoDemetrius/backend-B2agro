# Backend para Sistema de Mensagens e Newsletter

Este é um backend completo para gerenciar mensagens de contato e assinaturas de newsletter, desenvolvido com Node.js, Express e MongoDB.

## Estrutura do Projeto

```
backend/
├── config/
├── controllers/
│   ├── mensagemController.js
│   └── newsletterController.js
├── middlewares/
│   └── validacao.js
├── models/
│   ├── mensagemModel.js
│   └── newsletterModel.js
├── routes/
│   ├── mensagemRoutes.js
│   └── newsletterRoutes.js
├── services/
│   ├── mensagemService.js
│   └── newsletterService.js
├── utils/
├── .env
├── package.json
└── server.js
```

## Requisitos

- Node.js (v14 ou superior)
- MongoDB (local ou remoto)

## Instalação

1. Clone o repositório ou extraia os arquivos
2. Navegue até a pasta do projeto
3. Instale as dependências:

```bash
cd backend
npm install
```

4. Configure as variáveis de ambiente:
   - Renomeie o arquivo `.env` se necessário
   - Ajuste as configurações conforme seu ambiente:
     - `PORT`: porta onde o servidor irá rodar (padrão: 5000)
     - `MONGODB_URI`: URI de conexão com o MongoDB
     - `NODE_ENV`: ambiente de execução (development, production)

## Execução

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para iniciar o servidor em modo de produção:

```bash
npm start
```

## API Endpoints

### Mensagens

- **POST /api/mensagens**: Criar uma nova mensagem
  - Body: `{ nome, telefone, email, assunto, mensagem, aceitePolitica }`

- **GET /api/mensagens**: Listar todas as mensagens
  - Query params: `page`, `limit`, `status`

- **GET /api/mensagens/:id**: Buscar mensagem por ID

- **PATCH /api/mensagens/:id/status**: Atualizar status da mensagem
  - Body: `{ status }` (valores: pendente, lida, respondida, arquivada)

- **DELETE /api/mensagens/:id**: Excluir mensagem

- **GET /api/mensagens/estatisticas**: Obter estatísticas de mensagens

### Newsletter

- **POST /api/newsletter**: Inscrever email na newsletter
  - Body: `{ email, categoria }` (categorias: geral, contabil, rural, novidades)

- **GET /api/newsletter**: Listar todas as assinaturas
  - Query params: `page`, `limit`, `ativo`, `categoria`

- **GET /api/newsletter/:id**: Buscar assinatura por ID

- **GET /api/newsletter/verificar/:email**: Verificar se email está inscrito

- **PATCH /api/newsletter/:id/status**: Atualizar status da assinatura
  - Body: `{ ativo }`

- **DELETE /api/newsletter/cancelar/:email**: Cancelar assinatura por email

- **DELETE /api/newsletter/:id**: Excluir assinatura

- **GET /api/newsletter/estatisticas**: Obter estatísticas de assinaturas

## Exemplos de Uso

### Enviar uma mensagem de contato

```javascript
fetch('http://localhost:5000/api/mensagens', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'João Silva',
    telefone: '(11) 98765-4321',
    email: 'joao@exemplo.com',
    assunto: 'Dúvida sobre serviços',
    mensagem: 'Gostaria de saber mais sobre os serviços oferecidos.',
    aceitePolitica: true
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Inscrever email na newsletter

```javascript
fetch('http://localhost:5000/api/newsletter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'maria@exemplo.com',
    categoria: 'rural'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

## Segurança e Boas Práticas

- Validação de dados em todas as rotas
- Tratamento de erros centralizado
- Estrutura MVC para melhor organização
- Middlewares de segurança (helmet, cors)
- Logs em ambiente de desenvolvimento

## Manutenção e Evolução

Para adicionar novas funcionalidades:

1. Crie/modifique os models necessários
2. Implemente a lógica de negócio nos services
3. Crie os endpoints nos controllers
4. Adicione as rotas correspondentes

## Suporte

Para dúvidas ou problemas, entre em contato com o desenvolvedor.
