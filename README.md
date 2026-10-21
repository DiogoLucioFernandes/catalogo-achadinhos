# Catálogo de Achadinhos (modelo para afiliados)

Página de catálogo de produtos de afiliados (Shopee) com busca, categorias e destaque dos mais vendidos. O dono do catálogo gerencia os produtos por uma **planilha do Google**, sem mexer em código.

## O que ele faz

- Lista de produtos com **busca** (ignora acentos e maiúsculas), **filtro por categoria** e botão "Ver mais" (30 por vez).
- Carrossel de **mais vendidos**.
- **Contador de cliques** por produto, gravado na própria planilha.
- Produtos lidos de uma planilha publicada como CSV (com um leitor de CSV escrito por mim no código).
- Todas as configurações do cliente (nome, descrição, cores, WhatsApp) ficam em um único bloco `CONFIG`, para reaproveitar o modelo em outros catálogos.
- Textos dos produtos são escapados antes de entrar na página, para evitar injeção de HTML.

## Backend (`backend/Code.gs`)

Script do Google Apps Script que usa a planilha como banco de dados:

- `doGet`: devolve os produtos e registra os cliques (`?click=<link>`).
- `doPost`: protegido por senha, permite adicionar, ativar/desativar, marcar como mais vendido e excluir produtos (um **CRUD**).
- `LockService` evita que duas gravações simultâneas se sobreponham.

> A senha do painel é enviada junto com a requisição. É uma proteção simples, adequada para um painel pequeno, mas **não** equivale a um login completo.

## Tecnologias

HTML, CSS e JavaScript · Google Apps Script · Google Sheets

## Como foi feito

Desenvolvi com apoio de IA e vou estudar o código para entender cada parte, principalmente o leitor de CSV e o backend.

## Como usar

1. Crie uma planilha com as colunas: `nome`, `categoria`, `preco`, `link`, `imagem`, `maisvendido`, `ativo`, `cliques`.
2. Em Extensões → Apps Script, cole o `backend/Code.gs`, troque a `SENHA` e implante como aplicativo da web.
3. Publique a planilha como CSV (Arquivo → Compartilhar → Publicar na web).
4. No `index.html`, preencha o bloco `CONFIG` (`api` e `csv`).
5. Adicione `logo.png` e `favicon.png` na mesma pasta.

> Os links reais da planilha e do Apps Script foram removidos deste repositório.

## Próximos passos

- [ ] Trocar a senha simples do painel por autenticação de verdade.
- [ ] Separar CSS e JavaScript em arquivos próprios.
- [ ] Paginação por rolagem em vez do botão "Ver mais".

## Plano de estudo deste projeto

Metas de aprendizado. Vou marcar cada item quando eu conseguir explicá-lo sem ajuda da IA.

- [ ] Como `.filter()`, `.map()` e `.slice()` montam a lista na tela
- [ ] Como o `fetch` carrega a planilha e como o CSV vira uma lista de objetos
- [ ] A diferença entre `doGet` e `doPost` e o que é um CRUD
