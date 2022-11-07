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
geth init --datadir pow_node genesisi.json
```
Create password file for Node #1
```bash
echo 'your_password' > pow_node/password.txt
```

```bash
geth --datadir pow_node \
  --identity pow_node \
  --syncmode full \
  --port 30301  \
  --ws \
  --ws.addr 0.0.0.0 \
  --ws.port 8546 \
  --ws.origins "*" \
  --http \
  --http.addr 0.0.0.0 \
  --http.port 8545 \
  --http.corsdomain "*" \
  --http.api personal,eth,net,web3,txpool,miner,admin \
  --bootnodes enode://11bf7da782a0212d78bb608f7bc658c78cfdb74352fdb8d702c16fe618961edf5512a0b1cc7b186a22edb096becdf4c102976e1e17b9cc922b7c8932b24234bd@130.193.36.137:30301 \
  --networkid 50074 \
  --unlock 0xcaADF24be807C2DCAd3648c8D3E0068823aADB3D \
  --password pow_node/password.txt \
  --mine \
  --miner.threads=1 \
  --allow-insecure-unlock
```
