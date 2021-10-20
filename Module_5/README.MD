# DeFi. Final Projects.

## Links to DeFi projects:
* [USDT](https://tether.to/) and [XAUt](https://gold.tether.to/)  
* [Maker DAO](https://makerdao.com/ru/)
* [Compound Finance](https://compound.finance/)
* [0x](https://0x.org/)
* [dy/dx](https://dydx.exchange/)
* [Augur](https://augur.net/)

## Final projects:

# 1. Simple Escrow contract

* Deploy the following contract. Give me the contract address and lets use it together to safely buy 50 FINTECH tokens

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Escrow {
    uint256 public value;
    address payable public buyer;
    address payable public seller;
    
    enum State { Created, Locked, Release, Inactive }
    State public state;
    
    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this.");
        _;
    }
    
    modifier inState(State _state) {
        require(state == _state, "Invalid state.");
        _;
    }
    
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }
    
    modifier onlyBuyer() {
        require( msg.sender == buyer, "Only buyer can call this.");
        _;
    }
    constructor () payable {
        seller = msg.sender;
    }
    
    function setValue(uint256 _value) public {
        require(msg.sender == seller, "Only seller can call this.");
        value = _value;
    }
    
    function abort() public onlySeller inState(State.Created)
    {
        state = State.Inactive;
        seller.transfer(address(this).balance);
    }
    
    function confirmPurchase() public inState(State.Created) condition(msg.value == value) payable
    {
        require(value != 0, "Value cant be zero.");
        buyer = msg.sender;
        state = State.Locked;
    }
    
    function confirmReceived() public
    {
        require(msg.sender == buyer, "Only buyer can call this.");
        require(state == State.Locked, "Invalid state.");
        
        state = State.Release;
        seller.transfer(address(this).balance);
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
```


# 2. ERC-20 token swap 

contract address 0x58Fbd45744D56B5bD87aFA00b15eDc3162978266

* Deploy using Remix ERC-20 Token_1

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YOUR_TOKEN is ERC20 {
    constructor(uint256 initialSupply) ERC20("NAME", "TICKER") {
        _mint(msg.sender, initialSupply);
    }
    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
```
* create ERC-20 Token_2

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YOUR_TOKEN is ERC20 {
    constructor(uint256 initialSupply) ERC20("NAME", "TICKER") {
        _mint(msg.sender, initialSupply);
    }
    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
```
* deploy SWAP ERC-20 token contract on Rinkeby/Goerli testnet and share with me the contract address to exchange 50 FINTECH tokens to your own tokens.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract TokenSwap {

    mapping(ERC20 => mapping (address => uint256)) public balances;
    mapping(ERC20 => address) public tokens;
    
    /**
     * @dev Fund the contract and write transactions to mapping
     */
    function fundContract(uint256 amount, ERC20 token) external returns (bool) {
        tokens[token] = msg.sender;
        token.increaseAllowance(address(this), amount);
        token.transferFrom(msg.sender, address(this), amount);
        balances[token][msg.sender] = balances[token][msg.sender] + amount;
        balances[token][address(this)] = balances[token][address(this)] + amount;
        return true;
    }
    
    function swapTokens(ERC20 token_1, ERC20 token_2, uint256 amount) public returns (bool) {
        // check if tokens have assotiated addresses and contract has balances
        if (tokens[token_1] == address(0)){
                revert();
            }
        if (tokens[token_2] == address(0)){
                revert();
            }
        if (balances[token_1][address(this)]!=0 && balances[token_1][address(this)] < amount){
                revert();
            }
        if (balances[token_2][address(this)]!=0 && balances[token_2][address(this)] < amount){
                revert();
            }
        
        // send token 2 to address 1 and update balance
        address address_1 = tokens[token_1];
        
        token_2.transfer(address_1, amount);
        balances[token_2][address(this)] = balances[token_2][address(this)] - amount;
        
        // send token 1 to address 2 and update balance
        address address_2 = tokens[token_2];
        token_1.transfer(address_2, amount);
        balances[token_1][address(this)] = balances[token_1][address(this)] - amount;
        return true;
    }
    
    function callTokenBack(ERC20 token, uint256 amount) public {
        if (balances[token][address(this)]!=0 && balances[token][address(this)] < amount){
                revert();
            }
        if (tokens[token] == address(0)){
                revert();
            }
        if (tokens[token] == msg.sender){
                token.transfer(msg.sender, amount);
            }
    }
    
    function getSenderTokenBalance(ERC20 token) public view returns (uint256) {
       uint256 balance = token.balanceOf(msg.sender);
        return balance;
    }
    
    function getContractTonenBalance(ERC20 token) public view returns (uint256) {
        uint256 balance = token.balanceOf(address(this));
        return balance;
    }
    
    function getSupplierAddress(ERC20 token)public view returns (address){
        return tokens[token];
    }
}
```
