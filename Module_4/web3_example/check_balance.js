var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log("Checking  balance");
web3.eth.getBalance("0x4faF226eA0437A14ae882Fc05Df2439029312E3E")
.then((balance)=>{
    console.log("Account 0x4faF226eA0437A14ae882Fc05Df2439029312E3E balance", balance);
});