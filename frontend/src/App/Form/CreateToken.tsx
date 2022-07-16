import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { deposit } from "../../api/wallet";
import useAsync from "../../components/useAsync";
import "../../css/form/createtoken.css";
import { createToken } from "../../api/token";

interface Props {
  closeTokenForm: () => void;
  wallet: string;
}

interface Token {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
}
interface CreateTokenParams {
  web3: Web3;
  account: string;
  token: Token;
}

const CreateTokenForm: React.FC<Props> = ({ closeTokenForm, wallet }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [depositValue, setDepositValue] = useState(0);
  const [token, setToken] = useState<Token>({
    name: "",
    symbol: "",
    decimals: 0,
    totalSupply: 0,
  });
  const walletAddr = wallet;
  const { pending, call } = useAsync<CreateTokenParams, void>(
    ({ web3, account, token }) => createToken(web3, account, token)
  );

  function changeDepositValue(e: React.ChangeEvent<HTMLInputElement>) {
    setDepositValue(Number(e.target.value));
  }

  async function depositWallet() {
    if (pending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      return;
    }
    const value = Web3.utils.toBN(depositValue);
    const zero = Web3.utils.toBN(0);

    if (value.gt(zero)) {
      const { error, data } = await call({
        web3,
        account,
        token,
      });
      debugger;
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setDepositValue(0);
        closeTokenForm();
        alert("deposit successfully");
      }
    }
  }
  /**
   * hàm tạo mới token
   * @param e
   * @param walletAddr
   */
  async function addTokenHander(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    walletAddr: string
  ) {
    //TODO
  }

  return (
    <div className="base-form-mask">
      <div className="create-token-form">
        <div className="form-header">
          <h1>Create Token</h1>
          <div>Wallet Address: {wallet} </div>
        </div>
        <div className="form-body">
          <Form>
            <Form.Field>
              <label>Name</label>
              <Form.Input
                placeholder=""
                type="text"
                min={0}
                value={depositValue}
                onChange={changeDepositValue}
              />
              <label>Symbol</label>
              <Form.Input
                placeholder=""
                type="text"
                min={0}
                value={depositValue}
                onChange={changeDepositValue}
              />
              <label>Decimals</label>
              <Form.Input
                placeholder=""
                type="number"
                min={0}
                value={depositValue}
                onChange={changeDepositValue}
              />
              <label>Total Supply</label>
              <Form.Input
                placeholder=""
                type="number"
                min={0}
                value={depositValue}
                onChange={changeDepositValue}
              />
            </Form.Field>
          </Form>
        </div>

        <div className="form-footer">
          <Button
            color="blue"
            disabled={pending}
            loading={pending}
            onClick={(e) => addTokenHander(e, "wallet")}
          >
            Create
          </Button>
          <Button
            color="red"
            disabled={pending}
            loading={pending}
            onClick={closeTokenForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTokenForm;
