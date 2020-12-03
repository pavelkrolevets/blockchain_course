# Part 1. Solidity development

## Links to the code examples:

1. Web3js + ReactJs https://codesandbox.io/s/samplecontract-oyi11?file=/src/App.js

### 1. Value-types

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.8.0;

contract  ValueTypes {
    bool public someBool = true; // State variable
    int public someInt = -1;
    uint public someUint = 1;
    int8 public someInt8 = -127; //When unsigned, it has possible values ranging from 0 to 255; when signed, it has -128 to 127
    uint256 public someUint256 = 115792089237316195423570985008687907853269984665640564039457584007913129639935 //2^256-1 or 78 decimal digits max val

    // Fixed point numbers are not fully supported by Solidity yet. They can be declared, but cannot be assigned to or from.

    // Address

    // The address type comes in two flavours, which are largely identical:
    address public someAddress = 0x4faF226eA0437A14ae882Fc05Df2439029312E3E;
    //Holds a 20 byte value (size of an Ethereum address).
    address payable public  somePayableAddress = 0x4faF226eA0437A14ae882Fc05Df2439029312E3E;
    // Same as address, but with the additional members transfer and send.

    // String Literals and Types
    // written with either double or single-quotes ("foo" or 'bar'), and they can also be split into multiple consecutive parts ("foo" "bar" is equivalent to "foobar") As with integer literals, their type can vary, but they are implicitly convertible to bytes1, …, bytes32, if they fit, to bytes and to string.

    string public someString = "stringliteral";

    // Enums

    // Enums are one way to create a user-defined type in Solidity. They are explicitly convertible to and from all integer types but implicit conversion is not allowed. 
    enum ActionChoices { GoLeft, GoRight, GoStraight, SitStill }
    ActionChoices choice;
    ActionChoices constant defaultChoice = ActionChoices.GoStraight;

    function setGoStraight() public {
        choice = ActionChoices.GoStraight;
    }

    function getChoice() public view returns (ActionChoices) {
        return choice;
    }

    function getDefaultChoice() public pure returns (uint) {
        return uint(defaultChoice);
    }
}
```


### 2. Reference types

#### Data location

```The Ethereum Virtual Machine has three areas where it can store items.

The first is “storage”, where all the contract state variables reside. Every contract has its own storage and it is persistent between function calls and quite expensive to use.

The second is “memory”, this is used to hold temporary values. It is erased between (external) function calls and is cheaper to use.

The third one is the stack, which is used to hold small local variables. It is almost free to use, but can only hold a limited amount of values.
```

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.8.0;

contract C {
    // The data location of x is storage.
    // This is the only place where the
    // data location can be omitted.
    uint[] x;

    // The data location of memoryArray is memory.
    function f(uint[] memory memoryArray) public {
        x = memoryArray; // works, copies the whole array to storage
        uint[] storage y = x; // works, assigns a pointer, data location of y is storage
        y[7]; // fine, returns the 8th element
        y.pop(); // fine, modifies x through y
        delete x; // fine, clears the array, also modifies y
        // The following does not work; it would need to create a new temporary /
        // unnamed array in storage, but storage is "statically" allocated:
        // y = memoryArray;
        // This does not work either, since it would "reset" the pointer, but there
        // is no sensible location it could point to.
        // delete y;
        g(x); // calls g, handing over a reference to x
        h(x); // calls h and creates an independent, temporary copy in memory
    }

    function g(uint[] storage) internal pure {}
    function h(uint[] memory) public pure {}
}
```

#### Array

Arrays can have a compile-time fixed size, or they can have a dynamic size.

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.8.0;

contract C {
    function f(uint len) public pure {
        uint[] memory a = new uint[](7);
        bytes memory b = new bytes(len);
        assert(a.length == 7);
        assert(b.length == len);
        a[6] = 8;
    }
```

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.0 <0.8.0;

contract C {
    function f() public pure {
        uint[] memory x = new uint[](3);
        x[0] = 1;
        x[1] = 3;
        x[2] = 4;
    }
}
```

#### Array Slices

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >0.6.99 <0.8.0;

contract Proxy {
    /// @dev Address of the client contract managed by proxy i.e., this contract
    address client;

    constructor(address _client) {
        client = _client;
    }

    /// Forward call to "setOwner(address)" that is implemented by client
    /// after doing basic validation on the address argument.
    function forward(bytes calldata _payload) external {
        // Since ABI decoding requires padded data, we cannot
        // use abi.decode(_payload[:4], (bytes4)).
        bytes4 sig =
            _payload[0] |
            (bytes4(_payload[1]) >> 8) |
            (bytes4(_payload[2]) >> 16) |
            (bytes4(_payload[3]) >> 24);
        if (sig == bytes4(keccak256("setOwner(address)"))) {
            address owner = abi.decode(_payload[4:], (address));
            require(owner != address(0), "Address of owner cannot be zero.");
        }
        (bool status,) = client.delegatecall(_payload);
        require(status, "Forwarded call failed.");
    }
}

```

#### Structs

Solidity provides a way to define new types in the form of structs, which is shown in the following example:

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0 <0.8.0;

// Defines a new type with two fields.
// Declaring a struct outside of a contract allows
// it to be shared by multiple contracts.
// Here, this is not really needed.
struct Funder {
    address addr;
    uint amount;
}

contract CrowdFunding {
    // Structs can also be defined inside contracts, which makes them
    // visible only there and in derived contracts.
    struct Campaign {
        address payable beneficiary;
        uint fundingGoal;
        uint numFunders;
        uint amount;
        mapping (uint => Funder) funders;
    }

    uint numCampaigns;
    mapping (uint => Campaign) campaigns;

    function newCampaign(address payable beneficiary, uint goal) public returns (uint campaignID) {
        campaignID = numCampaigns++; // campaignID is return variable
        // We cannot use "campaigns[campaignID] = Campaign(beneficiary, goal, 0, 0)"
        // because the RHS creates a memory-struct "Campaign" that contains a mapping.
        Campaign storage c = campaigns[campaignID];
        c.beneficiary = beneficiary;
        c.fundingGoal = goal;
    }

    function contribute(uint campaignID) public payable {
        Campaign storage c = campaigns[campaignID];
        // Creates a new temporary memory struct, initialised with the given values
        // and copies it over to storage.
        // Note that you can also use Funder(msg.sender, msg.value) to initialise.
        c.funders[c.numFunders++] = Funder({addr: msg.sender, amount: msg.value});
        c.amount += msg.value;
    }

    function checkGoalReached(uint campaignID) public returns (bool reached) {
        Campaign storage c = campaigns[campaignID];
        if (c.amount < c.fundingGoal)
            return false;
        uint amount = c.amount;
        c.amount = 0;
        c.beneficiary.transfer(amount);
        return true;
    }
}
```

#### Mapping Types

Mapping types use the syntax `mapping(_KeyType => _ValueType)` and variables of mapping type are declared using the syntax `mapping(_KeyType => _ValueType) _VariableName`.

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.8.0;

contract MappingExample {

    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        approve(sender, msg.sender, amount);
        return true;
    }

    function approve(address owner, address spender, uint256 amount) public returns (bool) {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] -= amount;
        _balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
    }
}
```

### 3. Expressions and Control Structures

#### Function Calls

- Internal Function Calls

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.8.0;

contract C {
    function g(uint a) public pure returns (uint ret) { return a + f(); }
    function f() internal pure returns (uint ret) { return g(7) + f(); }
}

```

- External Function Calls

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.2 <0.8.0;

contract InfoFeed {
    function info() public payable returns (uint ret) { return 42; }
}

contract Consumer {
    InfoFeed feed;
    function setFeed(InfoFeed addr) public { feed = addr; }
    function callFeed() public { feed.info{value: 10, gas: 800}(); }
}
```

### 4. Web3js

Prepare

- install NodeJs https://nodejs.org/en/download/

  
```bash
mkdir web3_example && cd web3_example
npm init
npm install web3@0.20.1
npm install ethereumjs-tx@1.3.7
```

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

### Create a React front-end to communicate to blockchain smart contract

1.  Create React project
```sh
npx create-react-app .
```
2. Deploy smart contract
3. Create a button to store value in the contract
