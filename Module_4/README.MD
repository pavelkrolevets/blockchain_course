# Solidity development. Web3js + React.

# HOMEWORK Create a React front-end to communicate to blockchain smart contract

## Links to the code examples:

Sandbox https://codesandbox.io/s/communicationtochain-oyi11

Github https://github.com/pavelkrolevets/blockchain_course/blob/main/Module_4/front-end/src/App.js

#### Prerequisites:
- installed Node >= 14.0.0 and npm >= 5.6 
https://nodejs.org/en/

Ubuntu Node+NPM installation https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04/

MAC OSX Node+NPM installation https://nodejs.org/en/download/

1.  Create React project
```sh
npx create-react-app front-end 
```
```sh
cd front-end
```
2. Add `web3js` library
```sh
npm install && npm install web3@1.3.0 etehreumjs-tx@1.3.7
```
2. Open src/App.js in any Editor
```sh
vim src/App.js
```
3. Add desirable fucntions to the body of `function App()`

```js
import React, { useState } from "react";

export default function App() {
  const [show_balance, set_balance] = useState(0);
  const [transaction_message, set_transaction_message] = useState(
    "Simple transaction message"
  );
  const [raw_transaction_message, set_raw_transaction_message] = useState(
    "Signed transaction message"
  );

  function getBalance() {
    var Web3 = require("web3");
    var web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
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

  function sendTransaction() {
    var Web3 = require("web3");
    var web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );

    console.log("Sending  transaction");

    web3.eth
      .sendTransaction({
        from: "0x69f54a92ecCD20dAA471cE488B3fD89e1503CA79",
        to: "0x4faF226eA0437A14ae882Fc05Df2439029312E3E",
        value: "1000000000000000000"
      })
      .on("transactionHash", function (hash) {
        console.log("Hash", hash);
        set_transaction_message("Transaction hash " + hash);
      })
      .on("receipt", function (receipt) {
        console.log("Receipt ", receipt);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("Confirmation ", confirmationNumber);
        set_transaction_message("Confirmation " + confirmationNumber);
        if (parseInt(confirmationNumber, 10)===6) {
          set_transaction_message("Sucess! " + receipt.blockNumber);
        }
      })
      .on("error", console.error);
  }


  return (
    <div className="App">
      <div>
        <h4>Hello world Web3js</h4>
      </div>

      <div>
        <button onClick={getBalance}> Get Balance</button>
        <h4>{show_balance}</h4>
      </div>

      <div>
        <button onClick={sendTransaction}> Send simple transaction</button>
        <h4>{transaction_message}</h4>
      </div>
    </div>
  );
}
```

4. Run the app 
```sh
npm run start
```

5. Open in the Browser http://localhost:3000/

6. To stop the app runnin `CTRL+C`

# 2. Create Raw transaction

Sandbox link https://codesandbox.io/s/rawtransaction-f6o26?file=/src/App.js:1783-1814


```js
import React, { useState } from "react";

export default function App() {
  const [show_number, set_number] = useState(0);
  const [show_balance, set_balance] = useState(0);
  const [show_nonce, set_nonce] = useState(0);
  
  function getBalance() {
    var Web3 = require("web3");
    var web3 = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );
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

  function sendRawTransaction(){
    var Web3 = require("web3");
    const Tx = require("ethereumjs-tx");
    // Show Web3 where it needs to look for a connection to Ethereum.
    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      web3.eth
        .getTransactionCount("0xA31c2434062757563A6E27379dDD512F827e8795", "pending")
        .then((nonce) => {
          set_nonce(nonce);
          var gasPrice = "2"; //or get with web3.eth.gasPrice
          var gasLimit = 3000000;
          var addr = "0xA31c2434062757563A6E27379dDD512F827e8795";
          var toAddress = "0x4faF226eA0437A14ae882Fc05Df2439029312E3E";
          var amountToSend = "1000000000000000000"; //1 ETH
  
          var rawTransaction = {
            from: addr,
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasPrice * 1e9),
            gasLimit: web3.utils.toHex(gasLimit),
            to: toAddress,
            value: web3.utils.toHex(amountToSend),
            chainId: 50074, //remember to change this
          };
          // TODO !!! CHANGE PRIVATE KEY
          var privateKey =
            "";
          var privKey = new Buffer(privateKey, "hex");
  
          console.log("privKey  : ", privKey);
  
          var tx = new Tx(rawTransaction);
  
          tx.sign(privKey);
  
          var serializedTx = tx.serialize();
          console.log("serializedTx : " + serializedTx);
  
          web3.eth.sendSignedTransaction(
            "0x" + serializedTx.toString("hex"),
            function (err, hash) {
              if (!err) {
                set_number(hash);
                console.log("Txn Sent and hash is " + hash);
              } else {
                set_number(hash);
                console.error(err);
              }
            }
          );
        });
    }


  return (
    <div className="App">
    <button onClick={getBalance}>BALANCE</button>
    <h2>{show_balance}</h2>
    <button onClick={sendRawTransaction}>Send raw transaction</button>
    <h2>{show_nonce}</h2>
    <h2>{show_number}</h2>
  </div>
  );
}
```

# 3. Deploy Simple Contract

Codesandbox link https://codesandbox.io/s/deploy-simple-contract-uujom?file=/src/App.js

Solidity contract code 

```js
pragma solidity >=0.7.0 <0.8.0;

contract Storage {

    uint256 public number;

    function store(uint256 num) public { 
        number = num;
    }
    
    function retrieve() public view returns (uint256){
        return number;
    }
}
```

Exmaple address at Fintech Network `0x0B78227140616c1b07094909f78Df94172D87415`

Code example

```js
import React, { useState } from "react";
import "./styles.css";

var Web3 = require("web3");
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    "http://localhost:8545"
  )
);


var abi = [
	{
		"inputs": [],
		"name": "number",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let bin = "608060405234801561001057600080fd5b5060f38061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632e64cec11460415780636057361d14605d5780638381f58a146088575b600080fd5b604760a4565b6040518082815260200191505060405180910390f35b608660048036036020811015607157600080fd5b810190808035906020019092919050505060ad565b005b608e60b7565b6040518082815260200191505060405180910390f35b60008054905090565b8060008190555050565b6000548156fea2646970667358221220e4b80448d08a4db92448808b1d7a0371c1fc5f2389c9090faa77dbeade8c2fb364736f6c63430007060033"

export default function App() {
  const [show_balance, set_balance] = useState(0);
  const [show_address, set_address] = useState(0);

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

  async function deploySimpleContract(){
    let contract = new web3.eth.Contract(abi);
    let transaction = contract.deploy({data: "0x" + bin, arguments: []})
    let gas = await transaction.estimateGas({from: "0xA31c2434062757563A6E27379dDD512F827e8795"});
    let options = {
      to  : transaction._parent._address,
      data: transaction.encodeABI(),
      gas : gas
    };
    let signedTransaction = await web3.eth.accounts.signTransaction(options, "PRIVATE_KEY");
    let receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    set_address(receipt.contractAddress)
  }


  return (
    <div className="App">
      <h1>Simple Smart Contract</h1>
      <div>
        <button onClick={getBalance}>Check balance</button>
        <h4>{show_balance}</h4>
      </div>
      <div>
        <button onClick={deploySimpleContract}>Deploy contract</button>
        <h4>{show_address}</h4>
      </div> 
    </div>
  );
}

```

# 3. Communicate to simple contract (Set number, get number)

Codesanbox link https://codesandbox.io/s/communicate-to-simple-contract-bevvv?file=/src/App.js

Code example

```js
import React, { useState } from "react";
import "./styles.css";

var Web3 = require("web3");
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    "http://localhost:8545"
  )
);
// Deployed contract address!!!
var address = "0x0B78227140616c1b07094909f78Df94172D87415";

var abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256"
      }
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "number",
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
    name: "retrieve",
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
  const [show_number, set_number] = useState(0);
  const [show_receipt, set_receipt] = useState("");
  const [input_number, set_input_number] = useState(0);

  const handleChange = (e) => {
    set_input_number(e.target.value);
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

  function getNumber() {
    const contract = new web3.eth.Contract(abi, address);
    contract.methods
      .retrieve()
      .call({ from: "0x4faF226eA0437A14ae882Fc05Df2439029312E3E" })
      .then((result) => set_number(result));
  }

  async function setNumberAtContract() {
    set_receipt(`Please wait for the transaction hash`);
    // Sender Address!!!!
    var account = "0xA31c2434062757563A6E27379dDD512F827e8795";
    var privateKey =
      "PRIVATE_KEY";
    const contract = new web3.eth.Contract(abi, address);
    let gas = await contract.methods.store("1").estimateGas({from: "0xA31c2434062757563A6E27379dDD512F827e8795"});
    const setNumbertTx = contract.methods.store(input_number);
    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: account,
        to: address,
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
      <h1>Simple Smart Contract</h1>
      <div>
        <button onClick={getBalance}>Check balance</button>
        <h4>{show_balance}</h4>
      </div>
      <div>
        <input
          placeholder="enter number"
          onChange={(e) => handleChange(e)}
        ></input>
        <button onClick={setNumberAtContract}>Set number at contract</button>
        <h4>{show_receipt}</h4>
      </div>

      <div>
        <button onClick={getNumber}>Get number</button>
        <h4>{show_number}</h4>
      </div>
    </div>
  );
}
```

# 4. Deploy ERC20 

Codesandbox link https://codesandbox.io/s/deploy-erc20-contract-85cmc?file=/src/App.js

Solidity code

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YOUR_TOKEN is ERC20 {
    constructor(uint256 initialSupply, string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {
        _mint(msg.sender, initialSupply);
    }
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
```

# 5. Send ERC20 tokens to address

Codesanbox link https://codesandbox.io/s/send-erc20-yeivv?file=/src/App.js

Try everything by yourself!
