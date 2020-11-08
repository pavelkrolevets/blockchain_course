### Create genesis file with Proof-Of-Authority consensus permissioned chain

1. Clone the repo

```bash
git clone https://github.com/pavelkrolevets/blockchain_course.git && \
cd blockchain_course/Module_1/POA/
```
2. Create account address

```bash
geth account new --datadir blockchain_data
```
Write down output address 

2. We will pick 3 mining nodes which will run our first network. 
3. Chosen nodes addresses will be used to create genesis block and will be included to authority list. 

4. Run special utility to create genesis file.
```bash
pupeth 
```