const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");

const { verifyId } = require("./middlewares");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/repositories/:id", verifyId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title || !url || !techs || techs.length < 1) {
    return response
      .status(400)
      .json({ error: "One or more parameters were not sent" });
  }

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository id not found!" });
  }

  const { likes } = repositories[index];
  const repository = { id, title, url, techs, likes };

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository id not found!" });
  }

  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository id not found!" });
  }
  const { title, url, techs } = repositories[index];
  let { likes } = repositories[index];

  const repository = { id, title, url, techs, likes: ++likes };

  repositories[index] = repository;

  return response.json(repository);
});

module.exports = app;
