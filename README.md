# Introduction to blockchain programming (RANEPA FinTech)

### 1. Prepare the environment

### Windows

1. Install WSL Ubuntu 20.04 for Windows 10  ([here](https://docs.microsoft.com/en-us/windows/wsl/install-win10))
2. Install Windows Terminal ([here](https://github.com/microsoft/terminal.git))
3. Open Ubuntu WSL in terminal and install Go-Ethereum ([here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)):

```bash
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```
You may also build go-ethereum from source to install a specific version

### Linux 

1. Open terminal and install Go-Ethereum ([here](https://github.com/ethereum/go-ethereum/wiki/Building-Ethereum)):

```bash
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
```

### 2. Install MyCrypto

[Link to MyCrypto](https://download.mycrypto.com/)