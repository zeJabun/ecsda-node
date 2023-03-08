const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const verify = require("./scripts/verify");

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/balances", (req, res) => {
  const allBalances = balances;
  res.send({ allBalances });
});

app.post("/add/:address", (req, res) => {
  const { address } = req.params;
  balances[address] = balances[address] || 0; // [1
  balances[address] += 10;
  res.send({ balance: balances[address] });
});

app.post("/send", async (req, res) => {
  const { tx, signature, recoveryBit } = req.body;

  setInitialBalance(tx.sender);
  setInitialBalance(tx.recipient);

  const isValid = verify(tx, signature, recoveryBit, tx.sender);

  if (balances[tx.sender] < tx.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (isValid) {
    balances[tx.sender] -= tx.amount;
    balances[tx.recipient] += tx.amount;
    res.send({ balance: balances[tx.sender], message: { signature } });
  } else {
    res.status(400).send({ message: "Invalid signature" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
