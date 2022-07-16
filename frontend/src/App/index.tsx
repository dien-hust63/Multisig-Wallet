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
import { updateCommaList } from "typescript";
import { useAppContext } from "../contexts/App";
import { get } from "../api/wallet";

function App() {
  const {
    state: { web3, account, netId },
    updateAccount,
  } = useWeb3Context();

  const {
    state: { wallets },
    addWallet,
  } = useAppContext();

  const { state, set } = useMultiSigWalletContext();
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

  const {
    pending: walletP,
    error: walletErr,
    call: getWalletCall,
  } = useAsync<string, any>(async (params) => {
    if (!web3) {
      throw new Error("No web3");
    }
    await get(web3, account, params);
  });

  async function openWalletDetail(wallet: string) {
    const { error, data } = await getWalletCall(wallet);
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
    if (data) {
      set(data);
    }
    setShowMainDisplay(false);
  }

  function depositWallet() {
    setDispositFormOpen(true);
  }
  function updateWalletList(params: string) {
    alert("update wallet list");
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
                  {wallets.map((wallet) => {
                    return (
                      <tr key={wallet.address}>
                        <td
                          onClick={() => openWalletDetail(wallet.address)}
                          className="change-detail-link"
                        >
                          {wallet.name}
                        </td>
                        <td>{wallet.address}</td>
                        <td>{wallet.balance}</td>
                        <td>
                          <div className="required-confirm">
                            <div className="number-required">
                              {wallet.required_confirmation}
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
                          <Button
                            color="blue"
                            onClick={depositWallet}
                            size="tiny"
                          >
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
                    );
                  })}
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
        // Change address here
        <DepositForm
          closeDepositForm={() => setDispositFormOpen(false)}
          wallet="0x5deE543014058D3d4CdA46454dEe1662DDD13198"
        />
      ) : null}
      {withdrawFormOpen ? (
        <WithdrawForm
          closeWithDrawForm={() => setWithDrawFormOpen(false)}
          wallet="0x5deE543014058D3d4CdA46454dEe1662DDD13198"
        />
      ) : null}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
