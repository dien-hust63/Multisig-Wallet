import React, { useState } from "react";
import { Menu, Segment, Message, Button } from "semantic-ui-react";
import { unlockAccount } from "../../api/web3";
import { useWeb3Context } from "../../contexts/Web3";
import useAsync from "../../components/useAsync";
import "../../css/components/header.css";
interface Props {
  backMainDisplay: () => void;
}
const Header: React.FC<Props> = ({ backMainDisplay }) => {
  const {
    state: { account, balance, netId },
    updateAccount,
  } = useWeb3Context();

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
  const [activeItem, setActiveItem] = useState("wallets");

  function handleItemClick(name: any) {
    setActiveItem(name);
    backMainDisplay();
  }
  return (
    <div className="header">
      <Menu pointing inverted>
        <div className="wallet-icon"></div>
        <Menu.Item
          name="wallets"
          active={activeItem === "wallets"}
          onClick={() => handleItemClick("wallets")}
        />
        <Menu.Item
          name="transactions"
          active={activeItem === "transactions"}
          onClick={() => handleItemClick("transactions")}
        />
        <Menu.Menu position="right">
          {account ? (
            <>
              <div>Account: {account}</div>
            </>
          ) : (
            <div></div>
          )}
          {balance ? (
            <>
              <div>Balance: {balance}</div>
            </>
          ) : (
            <div></div>
          )}
          <Menu.Item name="Balance" />
          <Menu.Item
            name="Unlock Metamask"
            active={activeItem === "logout"}
            onClick={() => onClickConnect()}
          />
        </Menu.Menu>
      </Menu>

      {/* <Segment>
            <img src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
          </Segment> */}
    </div>
  );
};

export default Header;