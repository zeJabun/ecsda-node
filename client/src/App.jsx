import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Accounts from "./Accounts";
import "./App.scss";
import { useEffect, useState } from "react";
import server from "./server";
function App() {
  const [account, setAccount] = useState({
    publicKey: "",
    privateKey: "",
  });

  const [balances, setBalances] = useState(null);

  const fetchBalances = async () => {
    try {
      const { data: allBalances } = await server.get(`balances`);
      setBalances(allBalances);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div className="app">
      <Wallet
        balances={balances}
        account={account}
        setAccount={setAccount}
        fetchBalances={fetchBalances}
      />
      <Transfer account={account} setBalances={setBalances} />
      <div className="accounts">
        <Accounts balances={balances} />
      </div>
    </div>
  );
}

export default App;
