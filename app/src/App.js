// App.js
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import ConnectWallet from './ConnectWallet';
import Main from './Main';
import { ethers } from 'ethers';
import boomerangImage from './Boomerang.png';
import './styles/App.css'

// Goerli Testnet and Mainnet are supported
const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 1337] });

// This function is used to get the library from the provider
function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const title = "Boomerang";
  const description = "Boomerang is a programmable service that uses blockchain to securely disperse and retrieve information. With Boomerang, users can easily share sensitive data with others without fear of data breaches or third-party interference. Boomerang is built using React and integrates with web3 wallets to provide secure access to the Ethereum network.";
  
  return (
    <div className="container">
      <img src={boomerangImage} alt="Boomerang" className="image" />
      <h1 className="title">{title}</h1>
      <p className="description">{description}</p>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <Switch>
            <Route exact path="/">
              <ConnectWallet connector={injectedConnector} />
            </Route>
            <Route exact path="/main">
              <Main />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Router>
      </Web3ReactProvider>
    </div>
  );
}

export default App;
