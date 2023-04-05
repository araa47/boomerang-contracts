import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { abi } from "../Boomerang.json";

const BoomerangList = () => {
  const [boomerangs, setBoomerangs] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function fetchBoomerangs() {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.requestAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = abi.networks[networkId];
      const contractAddress = deployedNetwork.address;
      const boomerangContract = new web3.eth.Contract(abi, contractAddress);
      setContract(boomerangContract);

      const boomerangCount = await boomerangContract.methods.boomerangCount().call();
      const boomerangs = [];

      for (let i = 1; i <= boomerangCount; i++) {
        const boomerang = await boomerangContract.methods.boomerangs(i).call();
        boomerangs.push(boomerang);
      }

      setBoomerangs(boomerangs);
    }

    fetchBoomerangs();
  }, []);

  return (
    <div>
      <h2>List of Boomerangs</h2>
      <ul>
        {boomerangs.map((boomerang) => (
          <li key={boomerang.id}>
            <a href={`/${boomerang.id}`}>{boomerang.id}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoomerangList;
