/*
 * Link do desafio >>> https://github.com/Rocketseat/bootcamp-gostack-desafio-01/blob/master/README.md#desafio-01-conceitos-do-nodejs
 */

const express = require('express'); // Express
const server = express();
server.use(express.json()); // Necessário para o método update

// ------------ Array ------------ //
const projects = [];
let numeroDeRequisicoes = 0;

// ------------ Log Requests ------------ //

//server.use(logRequests);

server.use((req, res, next) => { 
    numeroDeRequisicoes++;
    console.log(`Requisição Nº: ${numeroDeRequisicoes} Método ${req.method}; URL: ${req.url}`);
    return next();
  });

// ------------ Middlewares ------------ //
function checkIdExistsInArray(req, res, next) {
  //const id = projects.find(p => p.id == id);
  const id = projects[req.params.index];
  if (!id) {
    return res.status(400).json({ error: 'Id does not exists' });
  }
  return next();
}

// ------------ Rotas ------------ //
server.get('/projects', (req, res) => { //-> List projects
  return res.json(projects);
});

server.get('/projects/:index', checkIdExistsInArray, (req, res) => { //-> List project ID
  const { index } = req.params;
  return res.json(projects[index]);
});

server.post('/projects', (req, res) => { //-> New project
  const { id, title } = req.body; // Declarando as duas variáveis no body
  const project = { // Adicionando todas as informações em uma variável
    id,
    title,
    task: [],
  };
  projects.push(project); // Alocando na lista
  return res.json(projects); // Exibindo toda lista
});

server.post('/projects/:index/tasks', checkIdExistsInArray, (req, res) => { //-> New task in project
  const { index } = req.params;
  const { task } = req.body;
  projects[index].task.push(task);
  return res.json(projects); // Exibindo toda lista
});

server.put('/projects/:index', checkIdExistsInArray, (req, res) => { //-> Upadte project
  const { index } = req.params;
  const { id, title } = req.body;

  projects[index] = {
    id,
    title,
    task: []
  };
  return res.json(projects); // Exibindo toda lista
});

server.delete('/projects/:index', checkIdExistsInArray, (req, res) => { //-> Delete project
  const { index } = req.params;
  projects.splice(index, 1);
  return res.json();
});

server.listen(3333); // 3000 / 3333 / 4000 //