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
