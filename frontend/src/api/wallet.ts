import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import walletTruffle from "../build/contracts/Wallet.json";
import {} from "../api/wallet";

// @ts-ignore
const Wallet = TruffleContract(walletTruffle);

interface Transaction {
  txIndex: number;
  destination: string;
  value: BN;
  data: string;
  executed: boolean;
  numConfirmations: number;
  isConfirmedByCurrentAccount: boolean;
  token: string;
}

interface GetResponse {
  name: string;
  address: string;
  balance: string;
  owners: string[];
  tokens: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

export async function get(
  web3: Web3,
  account: string,
  wallet: string
): Promise<GetResponse> {
  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(wallet);
  const balance = await web3.eth.getBalance(multiSig.address);
  const owners = await multiSig.getOwners();
  const name = await multiSig.name();
  const tokens = await multiSig.getTokens();
  const numConfirmationsRequired = await multiSig.numConfirmationsRequired();
  const transactionCount = await multiSig.getTransactionCount();

  // get 10 most recent tx
  const count = transactionCount.toNumber();
  const transactions: Transaction[] = [];
  for (let i = 1; i <= 10; i++) {
    const txIndex = count - i;
    if (txIndex < 0) {
      break;
    }

    const tx = await multiSig.getTransaction(txIndex);
    console.log(tx);
    const isConfirmed = await multiSig.isConfirmed(txIndex, account);

    transactions.push({
      txIndex,
      destination: tx.destination,
      value: tx.value,
      data: tx.data,
      token: tx.token,
      executed: tx.executed,
      numConfirmations: 1,
      isConfirmedByCurrentAccount: isConfirmed,
    });
  }

  return {
    name,
    address: multiSig.address,
    balance,
    owners,
    tokens,
    numConfirmationsRequired: numConfirmationsRequired.toNumber(),
    transactionCount: count,
    transactions,
  };
}

export async function deposit(
  web3: Web3,
  account: string,
  params: {
    wallet: string;
    value: BN;
  }
) {
  const { wallet, value } = params;
  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(wallet);

  await multiSig.sendTransaction({ from: account, value });
}

export async function createWallet(
  web3: Web3,
  account: string,
  params: {
    name: string;
    numConfirmationsRequired: number;
    owners: string[];
  }
) {
  const { name, numConfirmationsRequired, owners } = params;
  Wallet.setProvider(web3.currentProvider);
  const wallet = await Wallet.new(name, numConfirmationsRequired, owners, {
    from: account,
  });
  const walletDetail = await get(web3, account, wallet.address);
  return walletDetail;
}

export async function importWallet(
  web3: Web3,
  account: string,
  params: {
    address: string;
  }
) {
  const { address } = params;
  Wallet.setProvider(web3.currentProvider);
  const wallet = await Wallet.at(address);
  return wallet;
}

export async function getWalletAtAddress(
  web3: Web3,
  account: string,
  params: {
    address: string;
  }
) {
  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(params.address);
  return multiSig;
}

export async function submitTransaction(
  web3: Web3,
  account: string,
  params: {
    wallet: string;
    destination: string;
    // NOTE: error when passing BN type, so pass string
    value: string;
    data: string;
    token: string;
  }
) {
  const { destination, value, data, token, wallet } = params;

  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(wallet);

  await multiSig.submitTransaction(
    destination,
    value,
    new TextEncoder().encode(data),
    token,
    {
      from: account,
    }
  );
}

export async function confirmTransaction(
  web3: Web3 | null,
  account: string,
  params: {
    wallet: string;
    txIndex: number;
  }
) {
  const { txIndex, wallet } = params;
  if (web3) {
    Wallet.setProvider(web3.currentProvider);
    const multiSig = await Wallet.at(wallet);

    await multiSig.confirmTransaction(txIndex, {
      from: account,
    });
  }
}

export async function revokeConfirmation(
  web3: Web3,
  account: string,
  params: {
    wallet: string;
    txIndex: number;
  }
) {
  const { txIndex, wallet } = params;

  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(wallet);

  await multiSig.revokeConfirmation(txIndex, {
    from: account,
  });
}

export async function executeTransaction(
  web3: Web3,
  account: string,
  params: {
    wallet: string;
    txIndex: number;
  }
) {
  /*
    Exercise
    Write code that will call executeTransaction on MultiSigWallet contract
    */
  const { txIndex, wallet } = params;

  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(wallet);

  await multiSig.executeTransaction(txIndex, {
    from: account,
  });
}

export async function createToken(
  web3: Web3,
  account: string,
  params: {
    wallet: string;
    name: string;
    symbol: string;
    decimals: number;
    total: number;
  }
) {
  const { name, symbol, decimals, total, wallet } = params;

  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.at(wallet);

  await multiSig.createToken(name, symbol, decimals, total, {
    from: account,
  });
}

export async function getBalanceOfToken(
  web3: Web3,
  account: string,
  params: {
    wallet: string;
    addressToken: string;
    addrWallet: string;
  }
) {
  const { addrWallet, addressToken, wallet } = params;

  Wallet.setProvider(web3.currentProvider);
  const multiSig = await Wallet.deployed();

  await multiSig.getBalanceOfToken(addressToken, addrWallet, {
    from: account,
  });
}

export function subscribe(
  web3: Web3,
  address: string,
  callback: (error: Error | null, log: Log | null) => void
) {
  const multiSig = new web3.eth.Contract(Wallet.abi, address);

  const res = multiSig.events.allEvents((error: Error, log: Log) => {
    if (error) {
      callback(error, null);
    } else if (log) {
      callback(null, log);
    }
  });

  return () => res.unsubscribe();
}

interface Deposit {
  event: "Deposit";
  returnValues: {
    sender: string;
    amount: string;
    balance: string;
  };
}

interface SubmitTransaction {
  event: "SubmitTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
    destination: string;
    value: string;
    data: string;
    token: string;
  };
}

interface ConfirmTransaction {
  event: "ConfirmTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

interface RevokeConfirmation {
  event: "RevokeConfirmation";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

/*
Exercise
Define an interface ExecuteTransaction.
The shape of the interface should be the following:
 
{
  event: "ExecuteTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}
*/
interface ExecuteTransaction {
  event: "ExecuteTransaction";
  returnValues: {
    owner: string;
    txIndex: string;
  };
}

/*
Exercise - Add ExecuteTransaction to Log type
*/
type Log =
  | Deposit
  | SubmitTransaction
  | ConfirmTransaction
  | RevokeConfirmation
  | ExecuteTransaction;
