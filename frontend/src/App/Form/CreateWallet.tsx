import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, ButtonProps, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import useAsync from "../../components/useAsync";
import { deposit } from "../../api/multi-sig-wallet";
import "../../css/form/createwallet.css";
interface Props {
  closeCreateWalletForm: () => void;
}

interface CreatewalletParams {
  web3: Web3;
  account: string;
  value: BN;
}

interface Owners {
  name: string;
  address: string;
}
interface Wallet {
  name: string;
  requiredConfirm: BN;
  accounts: Owners[];
}

const CreateWalletForm: React.FC<Props> = ({ closeCreateWalletForm }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const [name, setName] = useState("");
  const [requiredConfirmarion, setRequiredConfirmation] = useState(0);
  const [owners, setOwners] = useState<Owners[]>([
    {
      name: "My Account",
      address: account,
    },
  ]);
  const [wallet, setWallet] = useState<Wallet>();
  const { pending, call } = useAsync<CreatewalletParams, void>(
    ({ web3, account, value }) => deposit(web3, account, { value })
  );

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function changeRequiredConfirmation(e: React.ChangeEvent<HTMLInputElement>) {
    setRequiredConfirmation(Number(e.target.value));
  }
  function addOwner() {
    setOwners([
      ...owners,
      {
        name: "",
        address: "",
      },
    ]);
  }

  function removeOwner(index: number) {
    let listOwners = [...owners];
    listOwners.splice(index, 1);
    setOwners(listOwners);
  }

  function changeOwnerName(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    let listOwners = [...owners];
    listOwners[index].name = e.target.value;
    setOwners(listOwners);
  }

  function changeOwnerAddress(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    let listOwners = [...owners];
    listOwners[index].address = e.target.value;
    setOwners(listOwners);
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
                type="text"
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
            <div className="wallet-header">
              <h3>Owners</h3>
              <div>
                <Button inverted color="blue" onClick={addOwner}>
                  Add
                </Button>
              </div>
            </div>
            <table className="ui selectable table wallet-table">
              <thead>
                <tr>
                  <th className="three wide">Name</th>
                  <th className="five wide">Address</th>
                  <th className="two wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner, index) => {
                  return (
                    <tr>
                      <td>
                        <input
                          type="text"
                          value={owner.name}
                          onChange={(e) => changeOwnerName(e, index)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={owner.address}
                          onChange={(e) => changeOwnerAddress(e, index)}
                        />
                      </td>
                      <td>
                        <Button
                          color="red"
                          disabled={pending}
                          loading={pending}
                          onClick={() => removeOwner(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          <Button
            color="red"
            disabled={pending}
            loading={pending}
            onClick={closeCreateWalletForm}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWalletForm;
