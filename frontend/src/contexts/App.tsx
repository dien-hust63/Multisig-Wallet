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
  wallets: Wallet[];
}

interface Wallet {
  name: string;
  address: string;
  balance: number;
  numConfirmationsRequired: number;
}

const INIT_STATE: State = {
  wallets: [
    // {
    //   name: "DKT",
    //   address: "0xc2eec85f0f3463231017748c52547f1c14e923ad",
    //   balance: 100,
    //   numConfirmationsRequired: 2,
    // },
  ],
};

const SET = "SET";
const ADD_WALLET = "ADD_WALLET";
const UPDATE_WALLET = "UPDATE_WALLET";
const UPDATE_BALANCE = "UPDATE_BALANCE";

interface Set {
  type: "SET";
  data: {
    wallets: Wallet[];
  };
}

interface AddWallet {
  type: "ADD_WALLET";
  data: {
    name: string;
    address: string;
    balance: number;
    numConfirmationsRequired: number;
  };
}

interface UpdateWallet {
  type: "UPDATE_WALLET";
  data: {
    name: string;
    address: string;
    balance: number;
    numConfirmationsRequired: number;
  };
}

interface UpdateBalance {
  type: "UPDATE_BALANCE";
  data: {
    balance: number;
    address: string;
  };
}

type Action = Set | AddWallet | UpdateWallet | UpdateBalance;

function reducer(state: State = INIT_STATE, action: Action) {
  switch (action.type) {
    case SET: {
      return {
        ...state,
        ...action.data,
      };
    }
    case ADD_WALLET: {
      localStorage.setItem(
        "wallet",
        JSON.stringify({
          ...state,
          wallets: [...state.wallets, action.data],
        })
      );
      return {
        ...state,
        wallets: [...state.wallets, action.data],
      };
    }
    case UPDATE_BALANCE: {
      let curWallet = state.wallets;
      let index = curWallet.findIndex((x) => x.address == action.data.address);
      if (index >= 0) {
        curWallet[index].balance += action.data.balance;
      }
      return {
        ...state,
        wallets: [...curWallet],
      };
    }
    case UPDATE_WALLET: {
      let curWallet = state.wallets;
      let index = curWallet.findIndex((x) => x.address == action.data.address);
      if (index >= 0) {
        curWallet[index] = { ...action.data };
      }
      return {
        ...state,
        wallets: [...curWallet],
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}
interface SetInputs {
  wallets: Wallet[];
}

interface AddWalletInputs {
  name: string;
  address: string;
  balance: number;
  numConfirmationsRequired: number;
}
interface UpdateBalanceInputs {
  address: string;
  balance: number;
}
const AppContext = createContext({
  state: INIT_STATE,
  set: (_data: SetInputs) => {},
  addWallet: (_data: AddWalletInputs) => {},
  updateWallet: (_data: AddWalletInputs) => {},
  updateBalanceWallet: (_data: UpdateBalanceInputs) => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

interface ProviderProps {}

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  function set(data: SetInputs) {
    dispatch({
      type: SET,
      data,
    });
  }

  function addWallet(data: AddWalletInputs) {
    dispatch({
      type: ADD_WALLET,
      data,
    });
  }

  function updateWallet(data: AddWalletInputs) {
    dispatch({
      type: UPDATE_WALLET,
      data,
    });
  }

  function updateBalanceWallet(data: UpdateBalanceInputs) {
    dispatch({
      type: UPDATE_BALANCE,
      data,
    });
  }

  return (
    <AppContext.Provider
      value={useMemo(
        () => ({
          state,
          set,
          addWallet,
          updateWallet,
          updateBalanceWallet,
        }),
        [state]
      )}
    >
      {children}
    </AppContext.Provider>
  );
};

export function Updater() {
  const {
    state: { web3, account },
  } = useWeb3Context();

  const { state, set, addWallet } = useAppContext();

  useEffect(() => {
    async function get(web3: Web3, account: string) {
      try {
        // const data = await getWalletList(web3, account);
        // set(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (web3) {
      get(web3, account);
    }
  }, [web3]);
}
