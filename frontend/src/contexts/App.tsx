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
  required_confirmation: number;
}

const INIT_STATE: State = {
  wallets: [
    {
      name: "DKT",
      address: "0x93e8c035f85fe7f1f0104a01de41c3a4bc4b46f4",
      balance: 100,
      required_confirmation: 2,
    },
    {
      name: "DIEN WALLET",
      address: "0x93e8c035f85fe7f1f0104a01de41c3a4bc4b46f8",
      balance: 100,
      required_confirmation: 2,
    },
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
    required_confirmation: number;
  };
}

interface UpdateWallet {
  type: "UPDATE_WALLET";
  data: {
    name: string;
    address: string;
    balance: number;
    required_confirmation: number;
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
      return {
        ...state,
        wallets: [...state.wallets, action.data],
      };
    }
    case UPDATE_BALANCE: {
      return {
        ...state,
      };
    }
    case UPDATE_WALLET: {
      return {
        ...state,
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
  required_confirmation: number;
}

const AppContext = createContext({
  state: INIT_STATE,
  set: (_data: SetInputs) => {},
  addWallet: (_data: AddWalletInputs) => {},
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

  return (
    <AppContext.Provider
      value={useMemo(
        () => ({
          state,
          set,
          addWallet,
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