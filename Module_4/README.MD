# Solidity development. Web3js + React.

# HOMEWORK Create a React front-end to communicate to blockchain smart contract

## Links to the code examples:

Sandbox https://codesandbox.io/s/samplecontract-oyi11?file=/src/App.js

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
npm install && npm install web3@1.3.0
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

# Code smaples

Check balance and 
```js
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log("Checking  balance");
web3.eth.getBalance("0x4faF226eA0437A14ae882Fc05Df2439029312E3E")
.then((balance)=>{
    console.log("Account 0x4faF226eA0437A14ae882Fc05Df2439029312E3E balance", balance);
});
```

Send transaction

```js
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log("Sending  transaction");

web3.eth.sendTransaction({
     from:'0x69f54a92ecCD20dAA471cE488B3fD89e1503CA79',
     to: '0x951FEd2Fa4d24F73b75028ad3D076FEf8232621C',
     value: '1000000000000000'})
     .on('transactionHash', function(hash){
         console.log('Hash', hash);
     })
.on('receipt', function(receipt){
    console.log('Receipt ', receipt);
})
.on('confirmation', function(confirmationNumber, receipt){
    console.log('Confirmation ', confirmationNumber);
})
.on('error', console.error);
```

Send raw transaction

##### Here we need an additional library

```bash
npm install ethereumjs-tx@1.3.7
```

```js
var Web3 = require("web3");
const Tx = require("ethereumjs-tx");

// Show Web3 where it needs to look for a connection to Ethereum.
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth
  .getTransactionCount("0x225ec14ce66FcfeD1A0dF19962D2F64454fDa52a", "pending")
  .then((nonce) => {
    console.log("Nonce  : ", nonce);
    var gasPrice = "2"; //or get with web3.eth.gasPrice
    var gasLimit = 3000000;
    var addr = "0x225ec14ce66FcfeD1A0dF19962D2F64454fDa52a";
    var toAddress = "0x4faF226eA0437A14ae882Fc05Df2439029312E3E";
    var amountToSend = "1000000000000000000"; //1 ETH

    var rawTransaction = {
      from: addr,
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(gasPrice * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: toAddress,
      value: web3.utils.toHex(amountToSend),
      chainId: 777, //remember to change this
    };

    var privateKey =
      "1c288aab4f529e8d89683bc83d3f222e5c1ada81d36be6ebe53a200a33efccd0";
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
          console.log("Txn Sent and hash is " + hash);
        } else {
          console.error(err);
        }
      }
    );
  });
```

Deploy smart contract and communicate to it from nodejs

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

```js
var Web3 = require("web3");
const Tx = require("ethereumjs-tx");

// Show Web3 where it needs to look for a connection to Ethereum.
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var address = "0x1D0A334994A361111A193B98e6548bF0E8395879";

var abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "number",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

var account = "0x225ec14ce66FcfeD1A0dF19962D2F64454fDa52a";

var privateKey =
  "1c288aab4f529e8d89683bc83d3f222e5c1ada81d36be6ebe53a200a33efccd0";

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

web3.eth.defaultAccount = web3.eth.accounts[0];
web3.personal.unlockAccount(web3.eth.defaultAccount, "Password");

contract = web3.eth.contract(abi).at(address);

contract.retrieve.call(function (err, result) {
  if (err) {
    return error(err);
  } else {
    console.log("getCount call executed successfully.", result);
  }
});

web3.eth.getTransactionCount(account, function (err, nonce) {
  var data = web3.eth
    .contract(abi)
    .at(address)
    .store.getData(1000, { from: account });

  var tx = new Tx({
    nonce: nonce,
    gasPrice: web3.toHex(web3.toWei("20", "gwei")),
    gasLimit: web3.toHex(100000),
    to: address,
    value: 0x0,
    data: data,
    chainId: 777, //remember to change this
  });
  var privKey = new Buffer(privateKey, "hex");
  tx.sign(privKey);

  var raw = "0x" + tx.serialize().toString("hex");
  web3.eth.sendRawTransaction(raw, function (err, transactionHash) {
    console.log(transactionHash);
  });
});
```
