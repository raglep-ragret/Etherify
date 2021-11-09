<p align="center">
  <a href="https://etherify.vercel.app/" target="blank"><img src="etherifyLogo.png" width="360" alt="Etherify Logo" /></a>
</p>

# Etherify Frontend

This is the frontend UI for [Etherify](https://etherify.vercel.app/). It's built with Next.js and Tailwind CSS.

## Commands

Run dev mode with `npm run dev`, or build the app with `npm build`.

## Gotchas

**The frontend imports the contract ABI and types from the parent package!** Make sure you `npm i` and `npx hardhat build` before you try to run this frontend.
