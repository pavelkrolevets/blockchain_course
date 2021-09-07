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
