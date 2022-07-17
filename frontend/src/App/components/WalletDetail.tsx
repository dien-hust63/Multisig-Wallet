import React, { useState } from "react";
import { Menu, Segment, Message, Button, Icon } from "semantic-ui-react";
import { useMultiSigWalletContext } from "../../contexts/MultiSigWallet";
import { useWeb3Context } from "../../contexts/Web3";
import "../../css/components/walletdetail.css";
import useAsync from "../../components/useAsync";
import { confirmTransaction, executeTransaction } from "../../api/wallet";
import CreateTokenForm from "../Form/CreateToken";
import DepositTokenForm from "../Form/DepositToken";
import WithdrawTokenForm from "../Form/WithDrawToken";
import Swal from "sweetalert2";

import AddUserForm from "../Form/AddUser";
import { stringify } from "querystring";

interface Props {
  wallet: string;
}

interface ConfirmTransParams {
  wallet: string;
  txIndex: number;
}

interface ExecuteTransParams {
  wallet: string;
  txIndex: number;
}
const WalletDetail: React.FC<Props> = ({ wallet }) => {
  const {
    state: { web3, account, balance, netId },
    updateAccount,
  } = useWeb3Context();

  const {
    state: { address },
  } = useMultiSigWalletContext();
  const { state } = useMultiSigWalletContext();
  const [showRegionOwner, setShowRegionOwners] = useState(true);
  const [showRegionToken, setShowRegionToken] = useState(true);
  const [showRegionTrans, setShowRegionTrans] = useState(true);
  const [createTokenFormOpen, setCreateTokenForm] = useState(false);
  const [depositTokenFormOpen, setDepositTokenForm] = useState(false);
  const [withdrawTokenFormOpen, setWithdrawTokenForm] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [tokenSelect, setTokenSelect] = useState("");

  // const {
  //   pending: walletP,
  //   error: walletErr,
  //   call: confirmTrans,
  // } = useAsync<ConfirmTransParams, any>(async (params) => {
  //   if (!web3) {
  //     throw new Error("NconfirmTransactiono web3");
  //   }
  //   await confirmTransaction(web3, account, params);
  // });

  const { pending: confirmPending, call: confirmCall } = useAsync<
    ConfirmTransParams,
    void
  >(async (params) => {
    if (!web3) {
      throw new Error("No web3");
    }
    return await confirmTransaction(web3, account, params);
  });

  const { pending: executePending, call: executeCall } = useAsync<
    ExecuteTransParams,
    void
  >(async (params) => {
    if (!web3) {
      throw new Error("No web3");
    }
    return await executeTransaction(web3, account, params);
  });

  async function confirmTransaction1(txIndex: number) {
    if (confirmPending) {
      return;
    }

    if (!web3) {
      Swal.fire("Error: No web3", "", "error");
      return;
    }
    const { error, data } = await confirmCall({
      txIndex,
      wallet: address,
    });
    if (error) {
      Swal.fire(`Error: ${error.message}`, "", "error");
    } else {
      Swal.fire(`Confirm successfully`, "", "success");
    }
  }

  async function executeTransaction1(txIndex: number) {
    if (executePending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      Swal.fire("Error: No web3", "", "error");
      return;
    }
    const { error, data } = await executeCall({
      txIndex,
      wallet: address,
    });
    if (error) {
      Swal.fire(`Error: ${error.message}`, "", "error");
    } else {
      Swal.fire(`Execute successfully`, "", "success");
    }
  }

  function depositTokenWallet(token: string) {
    setTokenSelect(token);
    setDepositTokenForm(true);
  }

  function withdrawTokenWallet(token: string) {
    setTokenSelect(token);
    setWithdrawTokenForm(true);
  }

  return (
    <div className="wallet-detail">
      <div className="wallet-detail-header">
        <h1>
          Name: {state.name}
          <br />
          Balance: {state.balance} ETH
        </h1>
        <div className="address"> Address Wallet: {state.address}</div>
      </div>
      <div className="wallet-detail-body">
        <div className="wallet-detail-region">
          <div className="wallet-detail-section">
            <div className="section-left">
              <h4 className="title">Owners</h4>
            </div>
            <div className="section-right">
              <Button inverted color="blue" onClick={() => setUserOpen(true)}>
                Add
              </Button>
              <Button
                inverted
                color="blue"
                className="button-down"
                onClick={() => setShowRegionOwners(!showRegionOwner)}
              >
                <Icon name="angle down" size="large" />
              </Button>
            </div>
          </div>
          {showRegionOwner ? (
            <div className="region-content">
              <table className="ui selectable table wallet-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {state.owners.map((owner, i) => (
                    <tr>
                      <td>Account {i}</td>
                      <td>{owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>

        <div className="wallet-detail-region">
          <div className="wallet-detail-section">
            <div className="section-left">
              <h4 className="title">Tokens</h4>
            </div>
            <div className="section-right">
              <Button
                inverted
                color="blue"
                onClick={() => setCreateTokenForm(true)}
              >
                Add
              </Button>
              <Button
                inverted
                color="blue"
                className="button-down"
                onClick={() => setShowRegionToken(!showRegionToken)}
              >
                <Icon name="angle down" size="large" />
              </Button>
            </div>
          </div>
          {showRegionToken ? (
            <div className="region-content">
              <table className="ui selectable table wallet-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Balance</th>
                    <th>Symbol</th>
                    <th>Decimals</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.detailTokens.length ? (
                    state.detailTokens.map((token) => {
                      return (
                        <tr key={token.address}>
                          <td>{token.name}</td>
                          <td>{token.address}</td>
                          <td>{token.balance}</td>
                          <td>{token.symbol}</td>
                          <td>{token.decimals}</td>
                          <td>
                            <Button
                              color="blue"
                              onClick={() => depositTokenWallet(token.address)}
                              size="tiny"
                            >
                              Deposit
                            </Button>
                            <Button
                              color="grey"
                              onClick={() => withdrawTokenWallet(token.address)}
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
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        Ví chưa quản lý token nào!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
          {createTokenFormOpen ? (
            <CreateTokenForm
              closeCreateTokenForm={() => setCreateTokenForm(false)}
              wallet={address}
            />
          ) : null}
          {depositTokenFormOpen ? (
            <DepositTokenForm
              closeDepositTokenForm={() => setDepositTokenForm(false)}
              wallet={address}
              token={tokenSelect}
            />
          ) : null}
          {withdrawTokenFormOpen ? (
            <WithdrawTokenForm
              closeWithDrawTokenForm={() => setWithdrawTokenForm(false)}
              wallet={address}
              token={tokenSelect}
            />
          ) : null}
        </div>
        <div className="wallet-detail-region">
          <div className="wallet-detail-section">
            <div className="section-left">
              <h4 className="title">Multisig transactions</h4>
            </div>
            <div className="section-right">
              <Button inverted color="blue">
                Add
              </Button>
              <Button
                inverted
                color="blue"
                className="button-down"
                onClick={() => setShowRegionTrans(!showRegionTrans)}
              >
                <Icon name="angle down" size="large" />
              </Button>
            </div>
          </div>
          {showRegionTrans ? (
            <div className="region-content">
              <table className="ui selectable table wallet-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Destination</th>
                    <th>Value</th>
                    <th>Data/Subject</th>
                    <th>Confirmations</th>
                    <th>Executed</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.length ? (
                    state.transactions.map((transaction, i) => (
                      <tr key={transaction.txIndex}>
                        <td>{i + 1}</td>
                        <td>{transaction.destination}</td>
                        <td>{transaction.value.toNumber()} ETH</td>
                        <td>{transaction.data}</td>
                        <td>
                          <div className="confirm-cell">
                            <div>{transaction.numConfirmations}</div>
                            <div>
                              {!transaction.isConfirmedByCurrentAccount &&
                              !transaction.executed ? (
                                <Button
                                  color="blue"
                                  onClick={() =>
                                    confirmTransaction1(transaction.txIndex)
                                  }
                                  size="tiny"
                                >
                                  Confirm
                                </Button>
                              ) : null}
                              {transaction.numConfirmations >=
                                state.numConfirmationsRequired &&
                              !transaction.executed ? (
                                <Button
                                  color="blue"
                                  onClick={() =>
                                    executeTransaction1(transaction.txIndex)
                                  }
                                  size="tiny"
                                >
                                  Execute
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td>{transaction.executed ? "Executed" : "Pending"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }}>
                        Chưa có giao dịch nào được thực hiện!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
      {userOpen ? (
        <AddUserForm
          closeAddUserForm={() => setUserOpen(false)}
          wallet={wallet}
        />
      ) : null}
    </div>
  );
};

export default WalletDetail;
