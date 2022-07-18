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
import { getTokenListInfo } from "../api/token";
import ImportWalletForm from "./Form/ImportWallet";
import Swal from "sweetalert2";

interface TokenListInputs {
  wallet: string;
  tokens: string[];
}

function App() {
  const {
    state: { web3, account, netId },
    updateAccount,
  } = useWeb3Context();

  const {
    state: { wallets },
    addWallet,
  } = useAppContext();

  const { state, set, updateTokenDetailList } = useMultiSigWalletContext();
  const [chosenWallet, setChosenWallet] = useState("");
  const [walletOpen, setWalletOpen] = useState(false);
  const [importWallet, setImportWallet] = useState(false);
  const [showMainDisplay, setShowMainDisplay] = useState(true);
  const [depositFormOpen, setDepositFormOpen] = useState(false);
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
    return await get(web3, account, params);
  });

  const {
    pending: tokenPending,
    error: tokenErr,
    call: getTokenList,
  } = useAsync<TokenListInputs, any>(async (params) => {
    if (!web3) {
      throw new Error("No web3");
    }
    return await getTokenListInfo(web3, account, params);
  });

  async function openWalletDetail(wallet: string) {
    setChosenWallet(wallet);
    const { error, data } = await getWalletCall(wallet);
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      set(data);
    }
    setShowMainDisplay(false);
  }

  function depositWallet(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    walletAddr: string
  ) {
    setChosenWallet(walletAddr);
    setDepositFormOpen(true);
  }

  function withdrawWallet(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    walletAddr: string
  ) {
    setChosenWallet(walletAddr);
    setWithDrawFormOpen(true);
  }

  function updateWalletList(params: string) {
    Swal.fire("Update wallet list", "", "success");
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
                  <Button
                    inverted
                    color="blue"
                    onClick={() => setImportWallet(true)}
                  >
                    Import
                  </Button>
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
                  {wallets.length ? (
                    wallets.map((wallet) => {
                      return (
                        <tr key={wallet.address}>
                          <td
                            onClick={() => openWalletDetail(wallet.address)}
                            className="change-detail-link"
                          >
                            {wallet.name}
                          </td>
                          <td>{wallet.address}</td>
                          <td>{wallet.balance} ETH</td>
                          <td>
                            <div className="required-confirm">
                              <div className="number-required">
                                {wallet.numConfirmationsRequired}
                              </div>
                              {/* <Button
                              color="grey"
                              onClick={depositWallet}
                              size="tiny"
                            >
                              Edit
                            </Button> */}
                            </div>
                          </td>
                          <td>
                            <Button
                              color="blue"
                              onClick={(e) => depositWallet(e, wallet.address)}
                              size="tiny"
                            >
                              Deposit
                            </Button>
                            <Button
                              color="grey"
                              onClick={(e) => withdrawWallet(e, wallet.address)}
                              size="tiny"
                            >
                              Withdraw
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }}>
                        Chưa có ví nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <WalletDetail wallet={chosenWallet} />
          )}
        </div>
      </div>
      {walletOpen ? (
        <CreateWalletForm closeCreateWalletForm={() => setWalletOpen(false)} />
      ) : null}
      {depositFormOpen ? (
        <DepositForm
          closeDepositForm={() => setDepositFormOpen(false)}
          wallet={chosenWallet}
        />
      ) : null}
      {withdrawFormOpen ? (
        <WithdrawForm
          closeWithDrawForm={() => setWithDrawFormOpen(false)}
          wallet={chosenWallet}
        />
      ) : null}
      {importWallet ? (
        <ImportWalletForm
          closeImportWallet={() => setImportWallet(false)}
          wallet={chosenWallet}
        />
      ) : null}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
