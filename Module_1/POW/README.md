# Ethereum Proof-of-Work permissionless blockchain

## 1. Clone the repo

```bash
git clone https://github.com/pavelkrolevets/blockchain_course.git
cd blockchain_course/Module_1
cd POW
```


## 2. Create account addresses for the POW mining node

```bash
geth account new --datadir pow_node
```
Write down ```public address ``` and dont forget the password
```
Public address of the key:   0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## 3. Initiate and run POW mining node


```bash
geth init fintech_2021.json --datadir pow_node/
```
Create password file for Node #1
```bash
echo 'your_password' > pow_node/password.txt
```

```bash
geth --datadir pow_node \
  --identity pow_node \
  --syncmode full \
  --port 30303  \
  --ws \
  --ws.addr 0.0.0.0 \
  --ws.port 8546 \
  --ws.origins "*" \
  --http \
  --http.addr 0.0.0.0 \
  --http.port 8545 \
  --http.corsdomain "*" \
  --http.api personal,eth,net,web3,txpool,miner,admin \
  --bootnodes enode://b95014943b078e231382b021c012dde556459ab181bd7d270e4261c0c4cf6dac5fa909a9c7959bf42f967fc37c08cc25442db657a286d7ed0b7f8305cccdf5a6@140.82.11.254:30303 \
  --networkid 50074 \
  --unlock 0x511de36d785eE346d8466bD37BA86fc4369e22B4 \
  --password pow_node/password.txt \
  --mine \
  --miner.threads=1 \
  --allow-insecure-unlock
```
