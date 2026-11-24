const express = require('express');
const app = express();
const PORT = 3000;

// Middleware essencial para a API conseguir ler JSON enviado no corpo (body) das requisições
app.use(express.json());

// Banco de dados simulado em memória (Array)
let produtos = [
  { id: 1, nome: 'Teclado Mecânico', preco: 250.00, estoque: 15 },
  { id: 2, nome: 'Mouse Gamer', preco: 120.50, estoque: 30 }
];
let proximoId = 3;

// 1. GET - Listar todos os produtos (Status 200 OK)
app.get('/produtos', (req, res) => {
  res.status(200).json(produtos);
});

// 2. GET - Buscar um produto específico por ID (Status 200 OK ou 404 Not Found)
app.get('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  res.status(200).json(produto);
});

// 3. POST - Criar um novo produto (Status 201 Created ou 400 Bad Request)
app.post('/produtos', (req, res) => {
  const { nome, preco, estoque } = req.body;

  // Validação simples
  if (!nome || preco === undefined) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
  }

  const novoProduto = {
    id: proximoId++,
    nome,
    preco,
    estoque: estoque || 0
  };

  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// 4. PUT - Atualizar produto COMPLETO (substitui todos os campos)
app.put('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { nome, preco, estoque } = req.body;

  // No PUT, exige-se o envio completo do recurso
  if (!nome || preco === undefined || estoque === undefined) {
    return res.status(400).json({ erro: 'Para PUT, informe nome, preco e estoque' });
  }

  produtos[index] = { id, nome, preco, estoque };
  res.status(200).json(produtos[index]);
});

// 5. PATCH - Atualizar produto PARCIALMENTE (atualiza só os campos enviados)
app.patch('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const produto = produtos.find(p => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  const { nome, preco, estoque } = req.body;

  if (nome !== undefined) produto.nome = nome;
  if (preco !== undefined) produto.preco = preco;
  if (estoque !== undefined) produto.estoque = estoque;

  res.status(200).json(produto);
});

// 6. DELETE - Remover um produto (Status 204 No Content ou 404 Not Found)
app.delete('/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' });
  }

  produtos.splice(index, 1);
  // 204 indica sucesso, mas sem corpo de resposta
  res.status(204).send();
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});