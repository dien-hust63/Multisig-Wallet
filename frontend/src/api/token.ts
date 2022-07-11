import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import tokenTruffle from "../build/contracts/W2TCoinERC20.json";

// @ts-ignore
const Token = TruffleContract(walletTruffle);
