import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, Form } from "semantic-ui-react";
import { useWeb3Context } from "../../contexts/Web3";
import { deposit, get } from "../../api/wallet";
import useAsync from "../../components/useAsync";
import "../../css/form/importwallet.css";
import { useAppContext } from "../../contexts/App";
import Swal from "sweetalert2";

interface Props {
  closeImportWallet: () => void;
  wallet: string;
}

const ImportWalletForm: React.FC<Props> = ({ closeImportWallet, wallet }) => {
  const {
    state: { web3, account },
  } = useWeb3Context();
  const { addWallet } = useAppContext();
  const [address, setAddressValue] = useState("");
  const [pendingImport, setPendingImport] = useState(false);
  const walletAddr = wallet;

  async function changeAddressValue(e: React.ChangeEvent<HTMLInputElement>) {
    setAddressValue(e.target.value);
  }
  async function importWallet() {
    if (web3) {
      setPendingImport(true);
      const wallet = await get(web3, account, address);
      addWallet({
        name: wallet.name,
        address: wallet.address,
        balance: Number(wallet.balance),
        numConfirmationsRequired: wallet.numConfirmationsRequired,
      });
      setPendingImport(false);
      closeImportWallet();
      Swal.fire("Import wallet successfully", "", "success");
    } else {
      Swal.fire("You must unclock Metamask", "", "warning");
    }
  }

  return (
    <div className="base-form-mask">
      <div className="import-wallet-form">
        <div className="form-header">
          <h1>Import Wallet</h1>
        </div>
        <div className="form-body">
          <Form>
            <Form.Field>
              <label>Wallet Address</label>
              <Form.Input
                placeholder=""
                type="text"
                value={address}
                onChange={changeAddressValue}
              />
            </Form.Field>
          </Form>
        </div>

        <div className="form-footer">
          <Button
            color="blue"
            disabled={pendingImport}
            loading={pendingImport}
            onClick={importWallet}
          >
            Import
          </Button>
          <Button
            color="red"
            disabled={pendingImport}
            loading={pendingImport}
            onClick={closeImportWallet}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportWalletForm;
