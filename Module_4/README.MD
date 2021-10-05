# Solidity development. Web3js + React.

# 1. Web3js

## Links to the code examples:

1. Web3js + ReactJs https://codesandbox.io/s/samplecontract-oyi11?file=/src/App.js


To run locally, prepare:

- install NodeJs https://nodejs.org/en/download/

  
```bash
mkdir web3_example && cd web3_example
npm init
npm install web3@0.20.1
npm install ethereumjs-tx@1.3.7
```

Create `index.js` file 
```bash
touch index.js
```

Open `index.js` in a text editor or IDE (VSCode), copy/paste code below.

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
web3.personal.unlockAccount(web3.eth.defaultAccount, "Gfdtk81,");

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

### HOMEWORK Create a React front-end to communicate to blockchain smart contract

1.  Create React project
```sh
npx create-react-app .
```
2. Deploy smart contract
3. Create a button to store value in the contract
