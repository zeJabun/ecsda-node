const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

console.log("private key:", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey).slice(1).slice(-20);

console.log("public key:", toHex(publicKey));