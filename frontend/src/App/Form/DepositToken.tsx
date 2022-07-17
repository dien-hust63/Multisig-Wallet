import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { deposit } from "../../api/wallet";
import useAsync from "../../components/useAsync";
import "../../css/form/depositform.css";
import { useMultiSigWalletContext } from "../../contexts/MultiSigWallet";
import Swal from "sweetalert2";

interface Props {
  closeDepositTokenForm: () => void;
  wallet: string;
  token: string;
}

interface DepositParams {
  web3: Web3;
  account: string;
  value: BN;
  wallet: string;
}

const DepositTokenForm: React.FC<Props> = ({
  closeDepositTokenForm,
  wallet,
  token,
}) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const { state } = useMultiSigWalletContext();

  const [depositTokenValue, setDepositTokenValue] = useState(0);
  const walletAddr = wallet;
  const { pending, call } = useAsync<DepositParams, void>(
    ({ web3, account, value, wallet }) =>
      deposit(web3, account, { value, wallet })
  );

  function changeDepositValue(e: React.ChangeEvent<HTMLInputElement>) {
    setDepositTokenValue(Number(e.target.value));
  }
  async function onSubmit(_e: React.FormEvent<HTMLFormElement>) {
    if (pending) {
      return;
    }

    if (!web3) {
      Swal.fire("No web3", "", "warning");
      return;
    }

    const value = Web3.utils.toBN(depositTokenValue);
    const zero = Web3.utils.toBN(0);

    if (value.gt(zero)) {
      const { error } = await call({
        web3,
        account,
        value,
        wallet: walletAddr,
      });

      if (error) {
        Swal.fire(`Error: ${error.message}`, "", "error");
      } else {
        setDepositTokenValue(0);
      }
    }
  }

  async function depositTokenWallet() {
    if (pending) {
      return;
    }

    if (!web3) {
      Swal.fire("No web3", "", "warning");
      return;
    }
    const value = Web3.utils.toBN(depositTokenValue);
    const zero = Web3.utils.toBN(0);

    if (value.gt(zero)) {
      const { error, data } = await call({
        web3,
        account,
        value,
        wallet: walletAddr,
      });
      debugger;
      if (error) {
        Swal.fire(`Error: ${error.message}`, "", "error");
      } else {
        setDepositTokenValue(0);
        let valueEther = web3.utils.fromWei(
          depositTokenValue.toString(),
          "ether"
        );
        // updateBalanceWallet({
        //   address: wallet,
        //   balance: Number(Number(valueEther).toFixed(4)),
        // });
        closeDepositTokenForm();
        Swal.fire(`Deposit successfully`, "", "success");
      }
    }
  }

  return (
    <div className="base-form-mask">
      <div className="deposit-form">
        <div className="form-header">
          <h1>Deposit Token</h1>
        </div>
        <div className="form-body">
          <Form>
            <Form.Field>
              <div>Token: {token} </div>
              <div>Wallet: {wallet}</div>
              <label>Amount(Wei)</label>
              <Form.Input
                placeholder=""
                type="number"
                min={0}
                value={depositTokenValue}
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
            onClick={depositTokenWallet}
          >
            Send transaction
          </Button>
          <Button
            color="red"
            disabled={pending}
            loading={pending}
            onClick={closeDepositTokenForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepositTokenForm;
