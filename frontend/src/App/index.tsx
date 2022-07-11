import React, { useState } from "react";
import { Button, Message } from "semantic-ui-react";
import { unlockAccount } from "../api/web3";
import "./index.css";
import useAsync from "../components/useAsync";
import { useWeb3Context } from "../contexts/Web3";
import MultiSigWallet from "./MultiSigWallet";
import Header from "./components/Header";
import Network from "./Network";
import CreateWalletForm from "./Form/CreateWallet";
import WalletDetail from "./components/WalletDetail";

function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();

  const [walletOpen, setWalletOpen] = useState(false);
  const [showMainDisplay, setShowMainDisplay] = useState(true);
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

  function openWalletDetail() {
    setShowMainDisplay(false);
  }

  return (
    <div className="App">
      <Header backMainDisplay={() => setShowMainDisplay(true)} />
      <div className="App-main">
        <div className="App-body">
          {showMainDisplay ? (
            <div className="main-display">
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
                    <td onClick={openWalletDetail}>John</td>
                    <td>Approved</td>
                    <td>None</td>
                    <td>None</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <WalletDetail />
          )}
        </div>
      </div>
      {walletOpen ? (
        <CreateWalletForm closeCreateWalletForm={() => setWalletOpen(false)} />
      ) : null}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
