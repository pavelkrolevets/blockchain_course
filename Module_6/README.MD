# DeFi. Final Projects.

## Links to DeFi projects:
* [USDT](https://tether.to/) and [XAUt](https://gold.tether.to/)  
* [Maker DAO](https://makerdao.com/ru/)
* [Compound Finance](https://compound.finance/)
* [0x](https://0x.org/)
* [dy/dx](https://dydx.exchange/)
* [Augur](https://augur.net/)

## Final projects:

# 1. ERC-20 token swap 

contract address 0x58Fbd45744D56B5bD87aFA00b15eDc3162978266

* Deploy using Remix ERC-20 Token_1

```js
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC20/ERC20.sol";

contract SwapToken1 is ERC20 {
    constructor () public ERC20("SwapToken1", "TKN1") {
        _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
    }
}
```
* create ERC-20 Token_2

```js
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC20/ERC20.sol";

contract SwapToken2 is ERC20 {
    constructor () public ERC20("SwapToken2", "TKN2") {
        _mint(msg.sender, 100000 * (10 ** uint256(decimals())));
    }
}
```
* deploy SWAP ERC-20 token contract on Rinkeby/Goerli testnet and share with me the contract address to exchange 50 FINTECH tokens to your own tokens.

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC20/ERC20.sol";
 
contract TokenSwap {

    mapping(ERC20 => mapping (address => uint256)) public balances;
    mapping(ERC20 => address) public tokens;
    
    /**
     * @dev Fund the contract and write transactions to mapping
     */
    function fundContract(uint256 amount, ERC20 token) external returns (bool) {
        tokens[token] = msg.sender;
        token.transferFrom(msg.sender, address(this), amount);
        balances[token][msg.sender] = balances[token][msg.sender] + amount;
        balances[token][address(this)] = balances[token][address(this)] + amount;
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
        tokens[token];
    }
}
```

# 2. Voting contract

* Deploy the following contract on Rinkeby/Goerli testnet and allow to vote the following address **0x4faF226eA0437A14ae882Fc05Df2439029312E3E**

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

/// @title Voting with delegation.
contract Ballot {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(bytes32[] memory proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        // For each of the provided proposal names,
        // create a new proposal object and add it
        // to the end of the array.
        for (uint i = 0; i < proposalNames.length; i++) {
            // `Proposal({...})` creates a temporary
            // Proposal object and `proposals.push(...)`
            // appends it to the end of `proposals`.
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    // Give `voter` the right to vote on this ballot.
    // May only be called by `chairperson`.
    function giveRightToVote(address voter) public {
        // If the first argument of `require` evaluates
        // to `false`, execution terminates and all
        // changes to the state and to Ether balances
        // are reverted.
        // This used to consume all gas in old EVM versions, but
        // not anymore.
        // It is often a good idea to use `require` to check if
        // functions are called correctly.
        // As a second argument, you can also provide an
        // explanation about what went wrong.
        require(
            msg.sender == chairperson,
            "Only chairperson can give right to vote."
        );
        require(
            !voters[voter].voted,
            "The voter already voted."
        );
        require(voters[voter].weight == 0);
        voters[voter].weight = 1;
    }

    /// Delegate your vote to the voter `to`.
    function delegate(address to) public {
        // assigns reference
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "You already voted.");

        require(to != msg.sender, "Self-delegation is disallowed.");

        // Forward the delegation as long as
        // `to` also delegated.
        // In general, such loops are very dangerous,
        // because if they run too long, they might
        // need more gas than is available in a block.
        // In this case, the delegation will not be executed,
        // but in other situations, such loops might
        // cause a contract to get "stuck" completely.
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;

            // We found a loop in the delegation, not allowed.
            require(to != msg.sender, "Found loop in delegation.");
        }

        // Since `sender` is a reference, this
        // modifies `voters[msg.sender].voted`
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            // If the delegate already voted,
            // directly add to the number of votes
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // If the delegate did not vote yet,
            // add to her weight.
            delegate_.weight += sender.weight;
        }
    }

    /// Give your vote (including votes delegated to you)
    /// to proposal `proposals[proposal].name`.
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        proposals[proposal].voteCount += sender.weight;
    }

    /// @dev Computes the winning proposal taking all
    /// previous votes into account.
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    // Calls winningProposal() function to get the index
    // of the winner contained in the proposals array and then
    // returns the name of the winner
    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
```

# 3. Simple Escrow contract

* Deploy the following contract to Rinkeby/Goerli testnet. Give me the contract address and lets use it together to safely buy 50 FINTECH tokens

```js
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.7.0;

contract Purchase {
    uint public value;
    address payable public seller;
    address payable public buyer;

    enum State { Created, Locked, Release, Inactive }
    // The state variable has a default value of the first member, `State.created`
    State public state;

    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    modifier inState(State _state) {
        require(
            state == _state,
            "Invalid state."
        );
        _;
    }

    event Aborted();
    event PurchaseConfirmed();
    event ItemReceived();
    event SellerRefunded();

    // Ensure that `msg.value` is an even number.
    // Division will truncate if it is an odd number.
    // Check via multiplication that it wasn't an odd number.
    constructor() payable {
        seller = msg.sender;
        value = msg.value / 2;
        require((2 * value) == msg.value, "Value has to be even.");
    }

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    function abort()
        public
        onlySeller
        inState(State.Created)
    {
        emit Aborted();
        state = State.Inactive;
        // We use transfer here directly. It is
        // reentrancy-safe, because it is the
        // last call in this function and we
        // already changed the state.
        seller.transfer(address(this).balance);
    }

    /// Confirm the purchase as buyer.
    /// Transaction has to include `2 * value` ether.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase()
        public
        inState(State.Created)
        condition(msg.value == (2 * value))
        payable
    {
        emit PurchaseConfirmed();
        buyer = msg.sender;
        state = State.Locked;
    }

    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived()
        public
        onlyBuyer
        inState(State.Locked)
    {
        emit ItemReceived();
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Release;

        buyer.transfer(value);
    }

    /// This function refunds the seller, i.e.
    /// pays back the locked funds of the seller.
    function refundSeller()
        public
        onlySeller
        inState(State.Release)
    {
        emit SellerRefunded();
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Inactive;

        seller.transfer(3 * value);
    }
}
```

