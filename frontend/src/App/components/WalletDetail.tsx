import React, { useState } from "react";
import { Menu, Segment, Message, Button, Icon } from "semantic-ui-react";
import { useMultiSigWalletContext } from "../../contexts/MultiSigWallet";
import { useWeb3Context } from "../../contexts/Web3";
import "../../css/components/walletdetail.css";
import useAsync from "../../components/useAsync";
import { confirmTransaction } from "../../api/wallet";
import AddUserForm from "../Form/AddUser";

interface Props {
  wallet: string;
}
const WalletDetail: React.FC<Props> = ({ wallet }) => {
  const {
    state: { web3, account, balance, netId },
    updateAccount,
  } = useWeb3Context();
  const { state } = useMultiSigWalletContext();
  const [showRegionOwner, setShowRegionOwners] = useState(true);
  const [showRegionToken, setShowRegionToken] = useState(true);
  const [showRegionTrans, setShowRegionTrans] = useState(true);
  const [userOpen, setUserOpen] = useState(false);
  interface ConfirmTransParams {
    txIndex: number;
  }

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

  async function confirmTransaction1(txIndex: number) {
    const test = await confirmTransaction(web3, account, {
      txIndex: txIndex,
      wallet: state.address,
    });
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
              <Button inverted color="blue">
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
                    <th>Multisig balance</th>
                    <th>Account balance</th>
                  </tr>
                </thead>
                <tbody>
                  {state.tokens.length ? (
                    state.tokens.map((token) => {
                      return (
                        <tr>
                          <td>W2T</td>
                          <td>0</td>
                          <td>00</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: "center" }}>
                        Ví chưa quản lý token nào!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                      <tr>
                        <td>{i + 1}</td>
                        <td>{transaction.destination}</td>
                        <td>{transaction.value} ETH</td>
                        <td>{transaction.data}</td>
                        <td>
                          <div className="confirm-cell">
                            <div>{transaction.numConfirmations}</div>
                            <div>
                              <Button
                                color="blue"
                                onClick={() =>
                                  confirmTransaction1(transaction.txIndex)
                                }
                                size="tiny"
                              >
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </td>
                        <td>{transaction.executed}</td>
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
