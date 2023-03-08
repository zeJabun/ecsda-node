function Accounts({ balances }) {
  return (
    <div className="container">
      {balances?.allBalances
        ? Object.entries(balances?.allBalances).map(([address, balance]) => {
            return (
              <div className="bal" key={`${address}-${balance}`}>
                <div>{address}:</div>
                <div>{balance}</div>
              </div>
            );
          })
        : "Loading..."}
    </div>
  );
}

export default Accounts;
