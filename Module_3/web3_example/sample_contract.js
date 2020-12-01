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
