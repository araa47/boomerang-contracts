import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import BoomerangContract from '../Boomerang.json';

function BoomerangCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const web3 = new Web3('http://localhost:8545');
    const contractAddress = '0x1d962e356A02d7b5350fE70D681f3583a2eD11Fe'; // Replace with your Boomerang contract address
    const boomerangContract = new web3.eth.Contract(BoomerangContract.abi, contractAddress);

    boomerangContract.methods.boomerangCount().call()
      .then((count) => {
        setCount(count);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h2>Boomerang Counter</h2>
      <p>Number of Boomerangs: {count}</p>
    </div>
  );
}

export default BoomerangCounter;
