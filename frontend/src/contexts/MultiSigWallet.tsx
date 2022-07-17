import Web3 from "web3";
import BN from "bn.js";
import React, {
  useReducer,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useWeb3Context } from "./Web3";
import { get as getMultiSigWallet, subscribe } from "../api/wallet";

interface State {
  name: string;
  tokens: string[];
  address: string;
  balance: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

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

const INITIAL_STATE: State = {
  name: "",
  tokens: [],
  address: "",
  balance: "0",
  owners: [],
  numConfirmationsRequired: 0,
  transactionCount: 0,
  transactions: [],
};

const SET = "SET";
const UPDATE_BALANCE = "UPDATE_BALANCE";
const ADD_TX = "ADD_TX";
const UPDATE_TX = "UPDATE_TX";
const ADD_OWNER = "ADD_OWNER";

interface Set {
  type: "SET";
  data: {
    address: string;
    balance: string;
    owners: string[];
    numConfirmationsRequired: number;
    transactionCount: number;
    transactions: Transaction[];
  };
}

interface UpdateBalance {
  type: "UPDATE_BALANCE";
  data: {
    balance: string;
  };
}

interface AddOwner {
  type: "ADD_OWNER";
  data: {
    address: string;
  };
}

interface AddTx {
  type: "ADD_TX";
  data: {
    txIndex: string;
    destination: string;
    value: string;
    data: string;
    token: string;
  };
}

interface UpdateTx {
  type: "UPDATE_TX";
  data: {
    account: string;
    txIndex: string;
    owner: string;
    executed?: boolean;
    confirmed?: boolean;
  };
}

type Action = Set | UpdateBalance | AddTx | UpdateTx | AddOwner;

function reducer(state: State = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case SET: {
      return {
        ...state,
        ...action.data,
      };
    }
    case ADD_OWNER: {
      return {
        ...state,
        owners: [...state.owners, action.data.address],
      };
    }
    case UPDATE_BALANCE: {
      return {
        ...state,
        balance: action.data.balance,
      };
    }
    case ADD_TX: {
      const {
        data: { txIndex, destination, value, data, token },
      } = action;

      const transactions = [
        {
          txIndex: parseInt(txIndex),
          destination,
          value: Web3.utils.toBN(value),
          data,
          executed: false,
          numConfirmations: 0,
          isConfirmedByCurrentAccount: false,
          token: token,
        },
        ...state.transactions,
      ];

      return {
        ...state,
        transactionCount: state.transactionCount + 1,
        transactions,
      };
    }
    case UPDATE_TX: {
      const { data } = action;

      const txIndex = parseInt(data.txIndex);

      const transactions = state.transactions.map((tx) => {
        if (tx.txIndex === txIndex) {
          const updatedTx = {
            ...tx,
          };

          if (data.executed) {
            /*
            Exercise
            Complete the if statement
            Set updatedTx.executed to true
            */
            updatedTx.executed = true;
          }
          if (data.confirmed !== undefined) {
            if (data.confirmed) {
              updatedTx.numConfirmations += 1;
              updatedTx.isConfirmedByCurrentAccount =
                data.owner === data.account;
            } else {
              updatedTx.numConfirmations -= 1;
              if (data.owner === data.account) {
                updatedTx.isConfirmedByCurrentAccount = false;
              }
            }
          }

          return updatedTx;
        }
        return tx;
      });

      return {
        ...state,
        transactions,
      };
    }
    default:
      return state;
  }
}

interface SetInputs {
  address: string;
  balance: string;
  owners: string[];
  numConfirmationsRequired: number;
  transactionCount: number;
  transactions: Transaction[];
}

interface UpdateBalanceInputs {
  balance: string;
}

interface AddOwnerInputs {
  address: string;
}

interface AddTxInputs {
  txIndex: string;
  destination: string;
  value: string;
  data: string;
  token: string;
}

interface UpdateTxInputs {
  account: string;
  txIndex: string;
  owner: string;
  confirmed?: boolean;
  executed?: boolean;
}

const MultiSigWalletContext = createContext({
  state: INITIAL_STATE,
  set: (_data: SetInputs) => {},
  updateBalance: (_data: UpdateBalanceInputs) => {},
  addTx: (_data: AddTxInputs) => {},
  updateTx: (_data: UpdateTxInputs) => {},
  addOwner: (_data: AddOwnerInputs) => {},
});

export function useMultiSigWalletContext() {
  return useContext(MultiSigWalletContext);
}

interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  function set(data: SetInputs) {
    dispatch({
      type: SET,
      data,
    });
  }

  function updateBalance(data: UpdateBalanceInputs) {
    dispatch({
      type: UPDATE_BALANCE,
      data,
    });
  }
  function addOwner(data: AddOwnerInputs) {
    dispatch({
      type: ADD_OWNER,
      data,
    });
  }

  function addTx(data: AddTxInputs) {
    dispatch({
      type: ADD_TX,
      data,
    });
  }

  function updateTx(data: UpdateTxInputs) {
    dispatch({
      type: UPDATE_TX,
      data,
    });
  }

  return (
    <MultiSigWalletContext.Provider
      value={useMemo(
        () => ({
          state,
          set,
          updateBalance,
          addTx,
          updateTx,
          addOwner,
        }),
        [state]
      )}
    >
      {children}
    </MultiSigWalletContext.Provider>
  );
};

export function Updater() {
  const {
    state: { web3, account },
  } = useWeb3Context();
  const { state, set, updateBalance, addTx, updateTx } =
    useMultiSigWalletContext();

  // useEffect(() => {
  //   async function get(web3: Web3, account: string, wallet: string) {
  //     try {
  //       const data = await getMultiSigWallet(web3, account, wallet);
  //       set(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   if (web3) {
  //     get(web3, account, "addd");
  //   }
  // }, [web3]);

  useEffect(() => {
    if (web3 && state.address) {
      return subscribe(web3, state.address, (error, log) => {
        if (error) {
          console.error(error);
        } else if (log) {
          switch (log.event) {
            case "Deposit":
              updateBalance(log.returnValues);
              break;
            case "SubmitTransaction":
              addTx(log.returnValues);
              break;
            case "ConfirmTransaction":
              updateTx({
                ...log.returnValues,
                confirmed: true,
                account,
              });
              break;
            case "RevokeConfirmation":
              updateTx({
                ...log.returnValues,
                confirmed: false,
                account,
              });
              break;
            /*
            Exercise
            Create a case statement for "ExecuteTransaction"
            Call updateTx with the following input
            {
              ...log.returnValues,
              executed: true,
              account,
            }
            */
            case "ExecuteTransaction":
              updateTx({
                ...log.returnValues,
                executed: true,
                account,
              });
              break;
            default:
              console.log(log);
          }
        }
      });
    }
  }, [web3, state.address]);
  return null;
}
