# Ethereum smart contracts

https://docs.soliditylang.org/en/v0.7.4/

## 1. Simple value storage

Requirements: Metamask, Remix, funds on Rinkeby network

- open https://remix.ethereum.org/
- in Metamask connect to Rinkeby
- go to Deploy and run transactions
- connect to Injected Web3 and chose account with funds
- compile and deploy to the network

```js
pragma solidity >=0.7.0 <0.8.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {

    uint256 number;
    // string public name;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public { 
        // string name_) public {
        number = num;
        // name = name_;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }
    // function retrieve_name() public returns (string){
    //     return name;
    // }
}
```

## 2. Mappings, structs, balance

```js
pragma solidity >=0.4.0 <0.8.0;

contract MemoryAndStorage {
 
 mapping(uint => User) users;
 struct User{
     uint id;
     uint balance;
 }
 constructor(){   
 }

 function addUser(uint id, uint balance) public {
     users[id] = User(id, balance);   
 }

function updateBalance(uint id, uint balance) public {
     User memory user = users[id];
     user.balance = balance;
 }
 
function getBalance(uint id) public returns (uint) {
    return users[id].balance;
    } 
}
```

## 3. ERC20 token 

Clone OpenZeppelin repo

```bash
git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git && cd openzeppelin-contracts
```
Install `remixd` tool (install node if you dont have npm)

https://github.com/ethereum/remixd

```bash
npm install -g @remix-project/remixd
```

Run `remixd` to open OpenZeppelin smart-contract forlders in Remix

```bash
remixd -s . --remix-ide https://remix.ethereum.org
```

Open `remixd` plugin in Remix IDE && create `<your_token_name.sol>` in `/token/ERC20`

```js
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ERC20.sol";

contract Fintech2020Token is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Fintech2020Token", "FIN2020") {
        _mint(msg.sender, initialSupply);
    }
    function decimals() public view virtual override returns (uint8) {
    return 2;
    }
}
```
Deployed FIN2020 ERC20 token address
`0xe2BC1b08aC777bd6FBA839B863Bb885A31De549b`

