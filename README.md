<p align="center">
  <a href="https://etherify.vercel.app/" target="blank"><img src="etherifyLogo.png" width="360" alt="Etherify Logo" /></a>
</p>

# Etherify

[Etherify](https://etherify.vercel.app/) is a decentralized Spotify playlist on the Ethereum blockchain. It was built as part of the [Buildspace](https://buildspace.so/) "Solidity + Smart Contracts" course.

## Project structure

The main directory is for the smart contract, built as a basic Hardhat app. The frontend UI is a Next.js app, which lives in the `/app` subdirectory.

## Smart Contract

Run `hardhat compile` to build the smart contract. **The frontend directly imports the contract ABI**, so be sure to do this after making any contract changes!
