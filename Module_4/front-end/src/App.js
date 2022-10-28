import React, { useState } from "react";
import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256"
      }
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256"
      }
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "tokenName",
        type: "string"
      },
      {
        internalType: "string",
        name: "tokenSymbol",
        type: "string"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export default function App() {
  const [show_balance, set_balance] = useState(0);
  const [show_name, set_name] = useState(0);
  const [show_symbol, set_symbol] = useState(0);
  const [show_receipt, set_receipt] = useState("");
  const [send_amount, set_send_amount] = useState(0);
  const [recipient, set_recipient] = useState(0);
  const [token_address, set_token_address] = useState(0);
  const [show_supply, set_supply] = useState(0);

  const handleAmountChange = (e) => {
    set_send_amount(e.target.value);
  };

  const handleRecipientChange = (e) => {
    set_recipient(e.target.value);
  };

  const handleTokenAddressChange = (e) => {
    set_token_address(e.target.value);
  };

  function getBalance() {
    console.log("Checking  balance");
    web3.eth
      .getBalance("0x4faF226eA0437A14ae882Fc05Df2439029312E3E")
      .then((balance) => {
        console.log(
          "Account 0x4faF226eA0437A14ae882Fc05Df2439029312E3E balance",
          balance
        );
        set_balance(Web3.utils.fromWei(balance, "ether"));
      });
  }

  function getName() {
    const contract = new web3.eth.Contract(abi, token_address);
    contract.methods
      .name()
      .call({ from: "0x4faF226eA0437A14ae882Fc05Df2439029312E3E" })
      .then((result) => set_name(result));
  }

  function getSymbol() {
    const contract = new web3.eth.Contract(abi, token_address);
    contract.methods
      .symbol()
      .call({ from: "0x4faF226eA0437A14ae882Fc05Df2439029312E3E" })
      .then((result) => set_symbol(result));
  }

  function getSupply() {
    const contract = new web3.eth.Contract(abi, token_address);
    contract.methods
      .totalSupply()
      .call({ from: "0x4faF226eA0437A14ae882Fc05Df2439029312E3E" })
      .then((result) => set_supply(result));
  }

  async function sendTokens() {
    set_receipt(`Please wait for the transaction hash`);
    // Sender Address!!!!
    var account = "0xA31c2434062757563A6E27379dDD512F827e8795";
    var privateKey = "PRIVATE_KEY";
    const contract = new web3.eth.Contract(abi, token_address);
    let gas = await contract.methods
      .transfer(recipient, send_amount)
      .estimateGas({ from: "0xA31c2434062757563A6E27379dDD512F827e8795" });
    console.log("Esimated gas", gas);
    const setNumbertTx = contract.methods.transfer(recipient, send_amount);
    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: account,
        to: token_address,
        data: setNumbertTx.encodeABI(),
        gas: gas
      },
      privateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(`Tx successfull with hash: ${createReceipt.transactionHash}`);
    set_receipt(`Tx successfull with hash: ${createReceipt.transactionHash}`);
  }

  return (
    <div className="App">
      <h1>Send ERC20 tokens</h1>
      <div>
        <Button onClick={getBalance} variant="contained">Check balance</Button>
        <h4>{show_balance}</h4>
      </div>

      <TextField id="outlined-basic" label="Outlined" variant="outlined"
        placeholder="enter ERC20 address"
        onChange={(e) => handleTokenAddressChange(e)}
      ></TextField>
      <div>
        <Button onClick={getName} variant="contained">Get name</Button>
        <h4>{show_name}</h4>
      </div>

      <div>
        <Button onClick={getSymbol} variant="contained">Get symbol</Button>
        <h4>{show_symbol}</h4>
      </div>

      <div>
        <Button onClick={getSupply} variant="contained">Get supply</Button>
        <h4>{show_supply}</h4>
      </div>

      <div>
        <input
          placeholder="enter recipient"
          onChange={(e) => handleRecipientChange(e)}
        ></input>
        <br />
        <input
          placeholder="enter number of tokens"
          onChange={(e) => handleAmountChange(e)}
        ></input>
        <br />
        <button onClick={sendTokens}>Send tokens to address</button>
        <h4>{show_receipt}</h4>
      </div>
    </div>
  );
}
