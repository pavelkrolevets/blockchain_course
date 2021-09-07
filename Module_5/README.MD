# Creating ERC20/ERC721 Dapp

Get free testnet tokens

https://faucet.goerli.mudit.blog/

https://faucet.rinkeby.io/

#### 1. Deploy using Remix IDE ERC20 contract

```js
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor () public ERC20("Token", "TKN") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
```

#### 2. Deploy using Remix IDE ERC721 token

```js
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC721/ERC721.sol";

contract MyCollectible is ERC721 {
    constructor() ERC721("MyCollectible", "MCO") public {
    }
}
```