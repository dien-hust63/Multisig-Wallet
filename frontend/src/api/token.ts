import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import tokenTruffle from "../build/contracts/W2TCoinERC20.json";
// @ts-ignore
const tokenInfo = TruffleContract(tokenTruffle);

interface TokenInformation {
    name: string;
    symbol: string;
    decimals: number;
}

export async function getTokenInfo(web3: Web3, address: string): Promise<TokenInformation> {
    tokenInfo.setProvider(web3.currentProvider);
    
    // const multiSig = await MultiSigWallet.deployed();
    const token = await tokenInfo.at(address);
    debugger
    const name = token.name;
    const symbol = token.symbol;
    const decimal  = token.decimals;
    return {
      name: name,
     symbol: symbol,
     decimals: 2
    };
  }