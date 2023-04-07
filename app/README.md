# Boomerang Frontend

This is the frontend for the Boomerang dApp.

## Setup

Notes, use 

```
nvm use 15.14.0
```

1. 
To run the frontend, first install the dependencies:
```
npm install
```
2. 
Create a .env file with contract address from previous steps 

REACT_APP_CONTRACT_ADDRESS=0xceC22a1f58A58985eedF4CfA5b5Ba16d2C07E617

3. On metamask add a local network and switch to this 

http://localhost:8545

4. 

Then, start the development server:

```
npm start
```


The frontend should now be accessible at http://localhost:3000.

5. Click on connect on top right, and allow access to metamask 

6. Make sure you are on local network!!! 



## Usage

The frontend allows you to view the total number of boomerangs and get details about individual boomerangs.

To view the total number of boomerangs, simply navigate to the homepage.

To get details about an individual boomerang, enter the boomerang ID into the form on the "Boomerang Details" page and click "Get Info".
