import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, ButtonProps, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { useAppContext } from "../../contexts/App";
import useAsync from "../../components/useAsync";
import { deposit } from "../../api/wallet";
import "../../css/form/createwallet.css";
import { createWallet } from "../../api/wallet";
import Swal from "sweetalert2";
interface Props {
  closeCreateWalletForm: () => void;
}

interface depositParams {
  web3: Web3;
  account: string;
  value: BN;
  wallet: string;
}

interface Owners {
  name: string;
  address: string;
}
interface Wallet {
  address?: string;
  name: string;
  numConfirmationsRequired: BN;
  accounts: Owners[];
}

interface CreateWalletParams {
  name: string;
  numConfirmationsRequired: number;
  owners: string[];
}

const CreateWalletForm: React.FC<Props> = ({ closeCreateWalletForm }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const {
    state: { wallets },
    addWallet,
  } = useAppContext();

  const [name, setName] = useState("");
  const [requiredConfirmarion, setRequiredConfirmation] = useState(0);
  const [pendingCreateWallet, setPendingCreateWallet] = useState(false);
  const [owners, setOwners] = useState<Owners[]>([
    {
      name: "My Account",
      address: account,
    },
  ]);
  // const { pending, call } = useAsync<depositParams, void>(
  //   ({ web3, account, value, wallet }) =>
  //     deposit(web3, account, { value, wallet })
  // );

  const {
    pending: walletP,
    error: walletErr,
    call: walletCall,
  } = useAsync<CreateWalletParams, any>(async (params) => {
    if (!web3) {
      throw new Error("No web3");
    }
    return await createWallet(web3, account, params);
  });

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
  async function createWalletHandler() {
    const ownerAddrs = owners.map((i) => i.address);
    // if (walletP) {
    //   return;
    // }
    // const { error, data } = await walletCall({
    //   name: name,
    //   numConfirmationsRequired: requiredConfirmarion,
    //   owners: ownerAddrs,
    // });

    // if (error) {
    //   alert(`Error: ${error.message}`);
    // } else {
    //   debugger;
    //   closeCreateWalletForm();
    //   // use app context update wallet list
    //   alert("Success");
    // }
    // nvdien: gọi qua useAsync ko lấy được data nên thử qua cách gọi API trực tiếp
    if (web3) {
      setPendingCreateWallet(true);
      const wallet = await createWallet(web3, account, {
        name: name,
        numConfirmationsRequired: requiredConfirmarion,
        owners: ownerAddrs,
      });
      setPendingCreateWallet(false);
      addWallet({
        name: wallet.name,
        address: wallet.address,
        balance: Number(wallet.balance),
        numConfirmationsRequired: wallet.numConfirmationsRequired,
      });
      closeCreateWalletForm();
      Swal.fire("Create wallet successfully", "", "success");
    } else {
      Swal.fire("You must unclock Metamask", "", "warning");
    }
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
                    <tr key={owner.address}>
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
                          disabled={pendingCreateWallet}
                          loading={pendingCreateWallet}
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
            disabled={pendingCreateWallet}
            loading={pendingCreateWallet}
            onClick={createWalletHandler}
          >
            Create
          </Button>
          <Button
            color="red"
            disabled={pendingCreateWallet}
            loading={pendingCreateWallet}
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
