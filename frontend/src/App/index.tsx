import React, { useState } from "react";
import { Button, Message } from "semantic-ui-react";
import { unlockAccount } from "../api/web3";
import "./index.css";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import MultiSigWallet from "./MultiSigWallet";
import Header from "./Header";
import Network from "./Network";
import CreateWalletForm from "./Form/CreateWallet";

function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();

  const [walletOpen, setWalletOpen] = useState(false);
  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
    }
    if (data) {
      updateAccount(data);
    }
  }

  function openCreateWalletForm() {
    setWalletOpen(true);
  }

  function closeCreateWalletForm() {
    setWalletOpen(false);
  }

  return (
    <div className="App">
      <Header />
      <div className="App-main">
        <div className="App-body">
          <div className="wallet-header">
            <h2>Wallets</h2>
            <div>
              <Button inverted color="blue" onClick={openCreateWalletForm}>
                Add
              </Button>
            </div>
          </div>
          <table className="ui selectable table wallet-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Balance</th>
                <th>Required Confirmations</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John</td>
                <td>Approved</td>
                <td>None</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Jamie</td>
                <td>Approved</td>
                <td>Requires call</td>
                <td>None</td>
              </tr>
              <tr>
                <td>Jill</td>
                <td>Denied</td>
                <td>None</td>
                <td>None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {walletOpen ? (
        <CreateWalletForm closeCreateWalletForm={closeCreateWalletForm} />
      ) : null}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
