import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { deposit } from "../../api/multi-sig-wallet";
import useAsync from "../../components/useAsync";
import "../../css/form/withdrawform.css";

interface Props {
  closeWithDrawForm: () => void;
}

interface WithDrawParams {
  web3: Web3;
  account: string;
  value: BN;
}

const WithdrawForm: React.FC<Props> = ({ closeWithDrawForm }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [withDrawValue, setWithDrawValue] = useState(0);
  const [address, setAddress] = useState("");
  const { pending, call } = useAsync<WithDrawParams, void>(
    ({ web3, account, value }) => deposit(web3, account, { value })
  );

  function changeWithDrawValue(e: React.ChangeEvent<HTMLInputElement>) {
    setWithDrawValue(Number(e.target.value));
  }
  function changeAddress(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(e.target.value);
  }
  async function onSubmit(_e: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      return;
    }

    const value = Web3.utils.toBN(withDrawValue);
    const zero = Web3.utils.toBN(0);

    if (value.gt(zero)) {
      const { error } = await call({
        web3,
        account,
        value,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setWithDrawValue(0);
      }
    }
  }

  async function withDrawWallet() {
    if (pending) {
      return;
    }

    if (!web3) {
      alert("No web3");
      return;
    }

    const value = Web3.utils.toBN(withDrawValue);
    const zero = Web3.utils.toBN(0);

    if (value.gt(zero)) {
      const { error } = await call({
        web3,
        account,
        value,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setWithDrawValue(0);
      }
    }
  }

  return (
    <div className="base-form-mask">
      <div className="withdraw-form">
        <div className="form-header">
          <h1>Withdraw</h1>
        </div>
        <div className="form-body">
          <Form>
            <Form.Field>
              <label>Amount(ETH)</label>
              <Form.Input
                placeholder=""
                type="number"
                min={0}
                value={withDrawValue}
                onChange={changeWithDrawValue}
              />
            </Form.Field>
            <Form.Field>
              <label>Address</label>
              <Form.Input
                placeholder=""
                type="text"
                value={address}
                onChange={changeAddress}
              />
            </Form.Field>
          </Form>
        </div>

        <div className="form-footer">
          <Button
            color="blue"
            disabled={pending}
            loading={pending}
            onClick={withDrawWallet}
          >
            Send transaction
          </Button>
          <Button
            color="red"
            disabled={pending}
            loading={pending}
            onClick={closeWithDrawForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawForm;
