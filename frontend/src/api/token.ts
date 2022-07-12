import Web3 from "web3";
import BN from "bn.js";
import TruffleContract from "@truffle/contract";
import tokenTruffle from "../build/contracts/W2TCoinERC20.json";
// @ts-ignore
const Token = TruffleContract(tokenTruffle);

interface TokenInformation {
  name: string;
  symbol: string;
  decimals: number;
}

export async function getTokenInfo(
  web3: Web3,
  address: string
): Promise<TokenInformation> {
  Token.setProvider(web3.currentProvider);

  // const multiSig = await MultiSigWallet.deployed();
  const token = await Token.at(address);
  debugger;
  const name = token.name;
  const symbol = token.symbol;
  const decimal = token.decimals;
  return {
    name: name,
    symbol: symbol,
    decimals: 2,
  };
}

export async function createToken(
  web3: Web3,
  account: string,
  params: {
    name: string;
    symbol: number;
    decimals: number;
    totalSupply: number;
  }
) {
  const { name, symbol, decimals, totalSupply } = params;

  Token.setProvider(web3.currentProvider);
  const token = await Token.new([name, symbol, decimals, totalSupply], {
    from: account,
  });
}

export async function getBalanceOf(
  web3: Web3,
  account: string,
  params: {
    address: string;
  }
) {
  const { address } = params;

  Token.setProvider(web3.currentProvider);
}
