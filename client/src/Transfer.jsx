import { bytesToHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { useState } from "react";
import server from "./server";
import { sign } from "ethereum-cryptography/secp256k1";

function Transfer({ account, setBalances }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const hashMessage = (message) => {
    const stringObj = JSON.stringify(message);
    const bytesArray = utf8ToBytes(stringObj);
    return keccak256(bytesArray);
  };

  async function signTx(tx) {
    const msgHash = hashMessage(tx);
    const signature = await sign(msgHash, account.privateKey, {
      recovered: true,
    });
    return signature;
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const tx = {
        sender: account.publicKey,
        amount: parseInt(sendAmount),
        recipient,
      };
      const [sig, recoveryBit] = await signTx(tx);
      const hexSig = bytesToHex(sig);
      const {
        data: {
          balance,
          message: { signature: sign },
        },
      } = await server.post(`send`, {
        tx: tx,
        signature: hexSig,
        recoveryBit: recoveryBit,
      });
      const { data: allBalances } = await server.get(`balances`);
      setBalances(allBalances);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Sign" />
    </form>
  );
}

export default Transfer;
