# Ethereum Proof-of-Authority permissioned blockchain containing 3 mining nodes and 1 bootnode

# 1. Prepare the environment and install Ethereum client

### <u> Windows 7 </u> 
1. Install VirtualBox [from here](https://download.virtualbox.org/virtualbox/6.1.16/VirtualBox-6.1.16-140961-Win.exe)
2. Install Ubuntu 20.04 OS as a new guest OS
3. Run Ubuntu guest OS and follow Linux instructions
4. Install TeamViewer [from here](https://www.teamviewer.com/en/)

### <u> Windows 10 </u>

1. Install WSL Ubuntu 20.04 for Windows 10  ([here](https://docs.microsoft.com/en-us/windows/wsl/install-win10))
2. Install Windows Terminal ([here](https://github.com/microsoft/terminal.git))
3. Open Ubuntu WSL in terminal and install Go-Ethereum ([here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)):

```bash
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```
4. Install TeamViewer [from here](https://www.teamviewer.com/en/)
   
If you having difficulties with setting up WSL - follow VirtualBox solution for Windows 7

### <u> Linux </u> 

1. Open terminal and install Go-Ethereum ([here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)):

```bash
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```
2. Install TeamViewer [from here](https://www.teamviewer.com/en/)


### <u> Mac </u> 
1. Open terminal and install Go-Ethereum ([here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)):
   
```bash
brew tap ethereum/ethereum
brew install ethereum
```
2. Install TeamViewer [from here](https://www.teamviewer.com/en/)
   


# 2. Prepare genesis block

## 1. Clone the repo

```bash
git clone https://github.com/pavelkrolevets/blockchain_course.git && \
cd blockchain_course/Module_1/POA/
```

## 2. Create account addresses for the authoriry mining nodes
* #### mining node #1
```bash
geth account new --datadir node1
```
Write down ```public address ``` and dont forget the password
```
Public address of the key:   0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

* #### mining node #2
```bash
geth account new --datadir node2
```
Write down ```public address ``` and dont forget the password
```
Public address of the key:   0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

* #### mining node #3
```bash
geth account new --datadir node3
```
Write down ```public address ``` and dont forget the password
```
Public address of the key:   0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Chosen nodes addresses will be used to create genesis block and will be included to authority list. These are our mining nodes which are allowed to the network.

## 3. Generate genesis file with `puppeth` utility. Follow the instructions from `puppeth`
```bash
puppeth
```
```bash
+-----------------------------------------------------------+
| Welcome to puppeth, your Ethereum private network manager |
|                                                           |
| This tool lets you create a new Ethereum network down to  |
| the genesis block, bootnodes, miners and ethstats servers |
| without the hassle that it would normally entail.         |
|                                                           |
| Puppeth uses SSH to dial in to remote servers, and builds |
| its network components out of Docker containers using the |
| docker-compose toolset.                                   |
+-----------------------------------------------------------+

Please specify a network name to administer (no spaces, hyphens or capital letters please)

> ilovefintech

Sweet, you can set this via --network=ilovefintech next time!

INFO [11-18|19:31:17.975] Administering Ethereum network           name=ilovefintech
WARN [11-18|19:31:17.975] No previous configurations found         path=/home/pk/.puppeth/ilovefintech

What would you like to do? (default = stats)
 1. Show network stats
 2. Configure new genesis
 3. Track new remote server
 4. Deploy network components

> 2

What would you like to do? (default = create)
 1. Create new genesis from scratch
 2. Import already existing genesis

> 1

Which consensus engine to use? (default = clique)
 1. Ethash - proof-of-work
 2. Clique - proof-of-authority

> 2

How many seconds should blocks take? (default = 15)

> 20

Which accounts are allowed to seal? (mandatory at least one)
> 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
> 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
> 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Which accounts should be pre-funded? (advisable at least one)
> 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
> 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
> 0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
> 0x

Should the precompile-addresses (0x1 .. 0xff) be pre-funded with 1 wei? (advisable yes)

> yes

Specify your chain/network ID if you want an explicit one (default = random)

> 777

INFO [11-18|19:36:29.564] Configured new genesis block

What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components

> 2

 1. Modify existing configurations
 2. Export genesis configurations
 3. Remove genesis configuration

> 2

Which folder to save the genesis specs into? (default = current)
  Will create ilovefintech.json, ilovefintech-aleth.json, ilovefintech-harmony.json, ilovefintech-parity.json

> [press enter] 

INFO [11-18|19:38:04.990] Saved native genesis chain spec          path=ilovefintech.json
ERROR[11-18|19:38:04.990] Failed to create Aleth chain spec        err="unsupported consensus engine"
ERROR[11-18|19:38:04.990] Failed to create Parity chain spec       err="unsupported consensus engine"
INFO [11-18|19:38:04.994] Saved genesis chain spec                 client=harmony path=ilovefintech-harmony.json

What would you like to do? (default = stats)
 1. Show network stats
 2. Manage existing genesis
 3. Track new remote server
 4. Deploy network components

> [Ctr + C]
```

Now we have genesis block configured in `ilovefintech.json`

## 3. Configure `bootnode` which is needed for nodes to start communicating between each other:

```bash
bootnode --genkey boot.key
```


## 4. Start `bootnode`

```bash
bootnode --nodekey=boot.key

enode://ee7642148364344c7cdcebbb3bb2fa3e3515db39aab253cb7dd118c1e41a631bf75069b85f23483a932033258cd7b2c36896cc55e2e90893c85f7c9aeb87a5cd@127.0.0.1:0?discport=30301
```
Get `bootnode` address from generated key. We will use it when we run mining nodes:

`enode://ee7642148364344c7cdcebbb3bb2fa3e3515db39aab253cb7dd118c1e41a631bf75069b85f23483a932033258cd7b2c36896cc55e2e90893c85f7c9aeb87a5cd@127.0.0.1:0`

## 5. Initiate and run mining nodes



* <b>In new terminal window</b> run Node #1

```bash
geth init ilovefintech.json --datadir node1/
```
Create password file for Node #1
```bash
echo 'your_password' > node1/password.txt
```

```bash
geth --datadir node1 \
  --identity node1 \
  --syncmode full \
  --port 30311  \
  --ws \
  --wsaddr 0.0.0.0 \
  --wsport 8546 \
  --wsorigins "*" \
  --rpc \
  --rpcaddr 0.0.0.0 \
  --rpcport 8545 \
  --rpccorsdomain "*" \
  --rpcapi shh,personal,db,eth,net,web3,txpool,miner,admin \
  --bootnodes enode://[your_boot.key]@127.0.0.1:30301 \
  --networkid 777 \
  --gasprice 0 \
  --unlock [node1_address] \
  --password node1/password.txt \
  --mine \
  --allow-insecure-unlock
```

* <b>In new terminal window</b> run Node #2

```bash
geth init ilovefintech.json --datadir node2/
```
Create password file
```bash
echo 'your_password' > node2/password.txt
```

```bash
geth --datadir node2 \
  --identity node2 \
  --syncmode full \
  --port 30312  \
  --rpcapi shh,personal,db,eth,net,web3,txpool,miner,admin \
  --bootnodes enode://[your_boot.key]@127.0.0.1:30301 \
  --networkid 777 \
  --gasprice 0 \
  --unlock [node2_address] \
  --password node2/password.txt \
  --mine \
  --allow-insecure-unlock
```

* <b>In new terminal window</b> run Node #3

```bash
geth init ilovefintech.json --datadir node3/
```
Create password file
```bash
echo 'your_password' > node3/password.txt
```

```bash
geth --datadir node3 \
  --identity node3 \
  --syncmode full \
  --port 30313  \
  --rpcapi shh,personal,db,eth,net,web3,txpool,miner,admin \
  --bootnodes enode://[your_boot.key]@127.0.0.1:30301 \
  --networkid 777 \
  --gasprice 0 \
  --unlock [node3_address] \
  --password node3/password.txt \
  --mine \
  --allow-insecure-unlock
```

Congradulations you are runing your own private blockchain!!!

Now lets connect to it using RemixIDE.
* Open [https://remix.ethereum.org/](https://remix.ethereum.org/)
* Go to Deploy & run transactions
* Chose Web3 provider at 127.0.0.1:8545
