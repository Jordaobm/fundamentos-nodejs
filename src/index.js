const express = require("express");
const uuid = require("uuid");

const app = express();

app.use(express.json());

let accounts = [];

function haveBalance(account) {
  return account?.statement?.reduce((acc, statement) => {
    if (statement?.type === "DEPOSIT") {
      return (acc = acc + statement?.amount);
    } else if (statement?.type === "WITHDRAW") {
      return (acc = acc - statement?.amount);
    }
  }, 0);
}

function verifyIfExistsAccount(req, res, next) {
  const account = accounts?.find((e) => e?.cpf === req?.headers?.cpf);

  if (!account) {
    return res?.status(400)?.json({
      error: "Não há uma conta cadastrada"
    });
  }

  req.account = account;

  return next();
}

// Listando todas as contas
app.get("/accounts", (req, res) => {
  return res?.status(200)?.json(accounts);
});

// Criando uma conta
app.post("/account", (req, res) => {
  const { cpf, name } = req?.body;

  if (accounts?.some((e) => e?.cpf === cpf)) {
    return res?.status(400)?.json({
      error: "Uma conta já existe com este CPF"
    });
  }

  accounts?.push({
    name,
    cpf,
    id: String(uuid.v4()),
    statement: []
  });

  return res?.status(201).json();
});

// Buscando conta por CPF
app.get("/account", verifyIfExistsAccount, (req, res) => {
  return res?.status(200)?.json({
    ...req?.account,
    balance: haveBalance(req?.account)
  });
});

// Depositando em conta
app.post("/deposit", verifyIfExistsAccount, (req, res) => {
  const { account } = req;

  const { description, amount } = req?.body;

  accounts = accounts?.map((acc) => {
    if (acc?.id === account?.id) {
      // aqui

      return {
        ...acc,
        statement: [
          ...acc?.statement,
          { id: uuid?.v4(), description, amount, type: "DEPOSIT" }
        ]
      };
    } else {
      return acc;
    }
  });
  return res?.status(201)?.json();
});

// Sacando em conta
app.post("/withdraw", verifyIfExistsAccount, (req, res) => {
  const { account } = req;
  const { amount } = req?.body;

  const balance = haveBalance(account);

  if (amount <= balance) {
    // permitir

    accounts = accounts?.map((acc) => {
      if (acc?.cpf === account?.cpf) {
        return {
          ...acc,
          statement: [
            ...acc?.statement,
            { id: uuid?.v4(), amount, type: "WITHDRAW" }
          ]
        };
      }

      return acc;
    });
  } else {
    return res
      ?.status(400)
      ?.json({ error: "Não há saldo suficiente para o saque" });
  }

  return res?.status(204)?.json();
});

// Excluíndo conta
app.delete("/account", verifyIfExistsAccount, (req, res) => {
  const { account } = req;

  accounts = accounts?.filter((acc) => acc?.cpf !== account?.cpf);

  return res?.status(204)?.json();
});

// Atualizando conta
app.put("/account", verifyIfExistsAccount, (req, res) => {
  const { account } = req;

  const { name } = req?.body;

  accounts = accounts?.map((acc) => {
    if (acc?.cpf === account?.cpf) {
      return { ...acc, name };
    }

    return acc;
  });

  return res?.status(200)?.json(accounts?.find((e) => e?.cpf === account?.cpf));
});

app.listen(3333, () => {
  console.log("Server is running 🚀");
});
