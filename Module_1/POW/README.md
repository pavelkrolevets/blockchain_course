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
  --bootnodes enode://ee44ae5a85159956a2b0d10631ef624c435a47a1fb028e6dc46cd86001697da79ff645c9eeafbf00cf082976b2243c405bdce374cc9364de727f2101d0631d7a@130.193.36.137:30301 \
  --networkid 50074 \
  --unlock 0xcaADF24be807C2DCAd3648c8D3E0068823aADB3D \
  --password pow_node/password.txt \
  --mine \
  --miner.threads=1 \
  --allow-insecure-unlock
```
