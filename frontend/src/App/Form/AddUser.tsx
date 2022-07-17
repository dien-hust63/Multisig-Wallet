import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { addUserToWallet, deposit } from "../../api/wallet";
import useAsync from "../../components/useAsync";
import "../../css/form/depositform.css";
import { useAppContext } from "../../contexts/App";
import Swal from "sweetalert2";
import { useMultiSigWalletContext } from "../../contexts/MultiSigWallet";

interface Props {
  closeAddUserForm: () => void;
  wallet: string;
}

interface AddUserParams {
  web3: Web3;
  account: string;
  address: string;
  wallet: string;
}

const AddUserForm: React.FC<Props> = ({ closeAddUserForm, wallet }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const { updateBalanceWallet } = useAppContext();
  const { addOwner } = useMultiSigWalletContext();
  const [address, setAddress] = useState("");
  const { pending, call } = useAsync<AddUserParams, void>(
    ({ web3, account, address, wallet }) =>
      addUserToWallet(web3, account, { address, wallet })
  );

  function changeAddress(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress(e.target.value);
  }

  async function addUser() {
    if (pending) {
      return;
    }

    if (!web3) {
      Swal.fire("No web3", "", "warning");
      return;
    }
    const { error, data } = await call({
      web3,
      account,
      address,
      wallet,
    });
    if (error) {
      Swal.fire(`Error: ${error.message}`, "", "error");
    } else {
      addOwner({ address });
      closeAddUserForm();
      Swal.fire("Add owner successfully", "", "success");
    }
  }

  return (
    <div className="base-form-mask">
      <div className="deposit-form">
        <div className="form-header">
          <h1>Add Owner</h1>
        </div>
        <div className="form-body">
          <Form>
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
            onClick={addUser}
          >
            Add
          </Button>
          <Button
            color="red"
            disabled={pending}
            loading={pending}
            onClick={closeAddUserForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
