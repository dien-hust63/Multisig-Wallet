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
import DepositForm from "./Form/DepositForm";
import WithdrawForm from "./Form/WithDrawForm";
import { useMultiSigWalletContext } from "../contexts/MultiSigWallet";

function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();
  const { state } = useMultiSigWalletContext();
  const [walletOpen, setWalletOpen] = useState(false);
  const [showMainDisplay, setShowMainDisplay] = useState(true);
  const [depositFormOpen, setDispositFormOpen] = useState(false);
  const [withdrawFormOpen, setWithDrawFormOpen] = useState(false);
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

  function depositWallet() {
    setDispositFormOpen(true);
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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      onClick={openWalletDetail}
                      className="change-detail-link"
                    >
                      Hust Wallet
                    </td>
                    <td>0xa3A70BCaDb48E17b38259e27E89564d74F05dBab</td>
                    <td> {state.balance} ETH</td>
                    <td>
                      <div className="required-confirm">
                        <div className="number-required">
                          {state.numConfirmationsRequired}
                        </div>
                        <Button
                          color="grey"
                          onClick={depositWallet}
                          size="tiny"
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                    <td>
                      <Button color="blue" onClick={depositWallet} size="tiny">
                        Deposit
                      </Button>
                      <Button
                        color="grey"
                        onClick={() => setWithDrawFormOpen(true)}
                        size="tiny"
                      >
                        Withdraw
                      </Button>
                    </td>
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
      {depositFormOpen ? (
        <DepositForm closeDepositForm={() => setDispositFormOpen(false)} />
      ) : null}
      {withdrawFormOpen ? (
        <WithdrawForm closeWithDrawForm={() => setWithDrawFormOpen(false)} />
      ) : null}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
