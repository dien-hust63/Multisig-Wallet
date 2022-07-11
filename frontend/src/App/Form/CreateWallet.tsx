import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import useAsync from "../../components/useAsync";
import { deposit } from "../../api/multi-sig-wallet";
import "../../css/form/createwallet.css";
interface Props {
  closeCreateWalletForm: any;
}

interface CreatewalletParams {
  web3: Web3;
  account: string;
  value: BN;
}

const CreateWalletForm: React.FC<Props> = () => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [name, setName] = useState("");
  const [requiredConfirmarion, setRequiredConfirmation] = useState(0);
  const { pending, call } = useAsync<CreatewalletParams, void>(
    ({ web3, account, value }) => deposit(web3, account, { value })
  );

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function changeRequiredConfirmation(e: React.ChangeEvent<HTMLInputElement>) {
    setRequiredConfirmation(Number(e.target.value));
  }

  async function createWallet() {
    alert("Test");
    // if (pending) {
    //   return;
    // }

    // if (!web3) {
    //   alert("No web3");
    //   return;
    // }

    // const value = Web3.utils.toBN(input);
    // const zero = Web3.utils.toBN(0);

    // if (value.gt(zero)) {
    //   const { error } = await call({
    //     web3,
    //     account,
    //     value,
    //   });

    //   if (error) {
    //     alert(`Error: ${error.message}`);
    //   } else {
    //     setInput("");
    //   }
    // }
  }

  return (
    <div className="base-form-mask">
      <div className="create-wallet-form">
        <div className="form-header">
          <h1> Deploy new wallet</h1>
        </div>
        <div className="form-body">
          <Form>
            <Form.Field>
              <label>Name</label>
              <Form.Input
                placeholder=""
                type="number"
                min={0}
                value={name}
                onChange={changeName}
              />
              <label>Required confirmations</label>
              <Form.Input
                placeholder=""
                type="number"
                min={0}
                value={requiredConfirmarion}
                onChange={changeRequiredConfirmation}
              />
            </Form.Field>
          </Form>
        </div>

        <div className="form-footer">
          <Button
            color="blue"
            disabled={pending}
            loading={pending}
            onClick={createWallet}
          >
            Deposit
          </Button>
          <Button color="red" disabled={pending} loading={pending}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWalletForm;
