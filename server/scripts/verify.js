const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

const hashTx = (tx) => {
  const stringObj = JSON.stringify(tx);
  const bytesArray = utf8ToBytes(stringObj);
  return keccak256(bytesArray);
};

const recoverKey = (tx, signature, recoveryKey) => {
  const txHash = hashTx(tx);
  const sig = hexToBytes(signature);
  return secp.recoverPublicKey(txHash, sig, recoveryKey);
};

const verify = (tx, signature, recoveryKey, publicKey) => {
  const recoveredKey = recoverKey(tx, signature, recoveryKey);

  return toHex(recoveredKey) === publicKey;
};

module.exports = verify;
