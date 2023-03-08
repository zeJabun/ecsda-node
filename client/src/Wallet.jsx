import server from "./server";
import { utils, getPublicKey } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ account, setAccount, balances, fetchBalances }) {
  const generatePrivateKey = () => {
    const privateKey = utils.randomPrivateKey();
    const publicKey = getPublicKey(privateKey);
    const address = getPublicKey(privateKey).slice(1).slice(-20);
    setAccount({
      privateKey: toHex(privateKey),
      publicKey: toHex(publicKey),
      address: `0x${toHex(address)}`,
    });
  };

  const addBalance = async () => {
    try {
      const { data: balance } = await server.post(`add/${account.publicKey}`, {
        publicKey: account.publicKey,
      });
      fetchBalances();
    } catch (ex) {
      alert(ex.response.data.message);
    }
  };

  return (
    <div className="container wallet">
      <button onClick={generatePrivateKey}>Generate Account</button>
      <button onClick={addBalance}>Add Balance</button>
      <h1>Your Wallet</h1>
      <label>
        {!!account.privateKey && !!account.publicKey && (
          <>
            <div>Private Key: {account?.privateKey}</div>
            <div>Public Key: {account?.address}</div>
          </>
        )}
      </label>

      <div className="balance">
        Balance: {balances?.allBalances?.[account?.publicKey] || 0}
      </div>
    </div>
  );
}

export default Wallet;
