const express = require("express");
const uuid = require("uuid");

const app = express();

app.use(express.json());

let repositories = [
  {
    id: String(uuid?.v4()),
    name: "Fundamentos ReactJS"
  }
];

app.get("/repositories", (req, res) => {
  return res?.status(200)?.json(repositories);
});

app.post("/repositories", (req, res) => {
  repositories?.push({
    ...req?.body,
    id: String(uuid?.v4())
  });

  return res?.status(200)?.json(repositories);
});

app.delete("/repository/:id", (req, res) => {
  repositories = repositories?.filter(
    (repository) => repository?.id !== req?.params?.id
  );

  return res?.status(200)?.json(repositories);
});

app.put("/repository", (req, res) => {
  repositories = repositories?.map((repository) => {
    if (repository?.id === req?.body?.id) {
      return req?.body;
    }

    return repository;
  });

  return res?.status(200)?.json(repositories);
});

app.patch("/repository/:id", (req, res) => {
  repositories = repositories?.map((repository) => {
    if (repository?.id === req?.params?.id) {
      return { ...repository, name: req?.body?.name };
    }

    return repository;
  });

  return res?.status(200)?.json(repositories);
});

app.listen(3333, () => {
  console.log("Server is running 🚀");
});
