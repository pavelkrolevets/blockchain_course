import React, { useState } from "react";
import './App.css';

function App() {
  const [show_balance, set_balance] = useState(0);
  const [show_number, set_number] = useState(0);

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
        console.log("Nonce  : ", nonce);
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

        var privateKey =
          "750abe8e310507f4aaa0043d3bcea78885924c3761bcdd16e92991d9c3ac4b52";
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
      <h2>{show_number}</h2>
    </div>
  );
}

export default App;
