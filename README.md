# Boomerang Smart Contract

This repository contains the source code for a smart contract called `Boomerang`. The `Boomerang` smart contract allows users to create a new `Boomerang` speechifying the time for the expiry and the update frequency.

## Getting Started

### Prerequisites

To run the tests for this smart contract, you will need to have the following tools installed on your machine:

- Node.js (version 14 or higher)
- Truffle (version 5 or higher)
- Ganache CLI (version 6 or higher)

### Installing

1. Clone this repository to your local machine.
2. Navigate to the root of the repository.
3. Run `npm install` to install the project dependencies.

### Running the Tests

To run the tests for the `Boomerang` smart contract, follow these steps:

1. Start Ganache CLI by running the following command:

```npx ganache-cli```

2. In a separate terminal window, compile and migrate the smart contract by running the following commands:

```
truffle compile
truffle migrate
```

3. Run the tests by running the following command:

truffle test

### Deploying to Testnet/Mainnet

To deploy the `Boomerang` smart contract to a testnet or mainnet, you will need to update the `truffle-config.js` file with the appropriate configuration settings for your network of choice.

Once you have updated the `truffle-config.js` file, you can deploy the smart contract by running the following command:

```truffle migrate --network <network-name>```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This project was created as part of a tutorial on Ethereum smart contract development.
