import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { deposit } from "../../api/wallet";
import useAsync from "../../components/useAsync";
import "../../css/form/depositform.css";

interface Props {
  closeDepositForm: () => void;
}

interface DepositParams {
  web3: Web3;
  account: string;
  value: BN;
}

const DepositForm: React.FC<Props> = ({ closeDepositForm }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [depositValue, setDepositValue] = useState(0);
  const { pending, call } = useAsync<DepositParams, void>(
    ({ web3, account, value }) => deposit(web3, account, { value })
  );

  function changeDepositValue(e: React.ChangeEvent<HTMLInputElement>) {
    setDepositValue(Number(e.target.value));
  }
  async function onSubmit(_e: React.FormEvent<HTMLFormElement>) {
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
      const { error } = await call({
        web3,
        account,
        value,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setDepositValue(0);
      }
    }
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
      const { error } = await call({
        web3,
        account,
        value,
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setDepositValue(0);
        closeDepositForm();
        alert("deposit successfully");
      }
    }
  }

  return (
    <div className="base-form-mask">
      <div className="deposit-form">
        <div className="form-header">
          <h1>Deposit</h1>
        </div>
        <div className="form-body">
          <Form>
            <Form.Field>
              <label>Amount(ETH)</label>
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
            onClick={depositWallet}
          >
            Send transaction
          </Button>
          <Button
            color="red"
            disabled={pending}
            loading={pending}
            onClick={closeDepositForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;
