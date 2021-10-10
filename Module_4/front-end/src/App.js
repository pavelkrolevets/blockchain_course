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
        from: "0xA31c2434062757563A6E27379dDD512F827e8795",
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
        console.log("Confirmation ", parseInt(confirmationNumber, 10));
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
