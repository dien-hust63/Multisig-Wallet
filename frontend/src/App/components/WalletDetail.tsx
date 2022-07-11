import React, { useState } from "react";
import { Menu, Segment, Message, Button, Icon } from "semantic-ui-react";
import { useMultiSigWalletContext } from "../../contexts/MultiSigWallet";
import { useWeb3Context } from "../../contexts/Web3";
import "../../css/components/walletdetail.css";
function WalletDetail() {
  const {
    state: { account, balance, netId },
    updateAccount,
  } = useWeb3Context();
  const { state } = useMultiSigWalletContext();
  const [showRegionOwner, setShowRegionOwners] = useState(false);
  const [showRegionToken, setShowRegionToken] = useState(false);
  const [showRegionTrans, setShowRegionTrans] = useState(false);

  function confirmTransaction() {
    alert("test");
  }
  return (
    <div className="wallet-detail">
      <div className="wallet-detail-header">
        <h1>Ví Tạo {state.balance} ETH</h1>
        <div className="address">{state.address}</div>
      </div>
      <div className="wallet-detail-body">
        <div className="wallet-detail-region">
          <div className="wallet-detail-section">
            <div className="section-left">
              <h4 className="title">Owners</h4>
            </div>
            <div className="section-right">
              <Button inverted color="blue">
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
                  <tr>
                    <td>W2T</td>
                    <td>0</td>
                    <td>00</td>
                  </tr>
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
              {/* <Button inverted color="blue">
              Add
            </Button> */}
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
                  <tr>
                    <td>1</td>
                    <td>0x1ED45D067Dd06dC0D429DD6356f33F41cf4567b8</td>
                    <td>0.00 ETH</td>
                    <td>
                      Transfer 10 W2T to
                      0x57aCDD7B4E44538FACc549e99C9a842D58B8b15F
                    </td>
                    <td>
                      <div className="confirm-cell">
                        <div>List Owners</div>
                        <div>
                          <Button
                            color="blue"
                            onClick={confirmTransaction}
                            size="tiny"
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td>Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default WalletDetail;
