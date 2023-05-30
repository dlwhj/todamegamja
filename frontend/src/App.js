import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";


import data from "./Potato.json";

/* 
NOTE: After deploying the contract you have to change this variable to
   address of your contract.
*/
const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  const [contract, setContract] = useState(undefined);

  const [potatoCount, setPotatoCount] = useState(0);
  const [selectedPotato, setSelectedPotato] = useState(null);
  const [players, setPlayers] = useState([]);
 
  const connect = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);

      const accounts = await provider.send("eth_requestAccounts", []);
      console.log(accounts[0]);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(address, data.abi, signer);
      setContract(contract);
      fetchPotatoData(contract);
    } else {
     console.log("No wallet (e.g. MetaMask) detected!");
    }
  };

  const fetchPotatoData = async () => { 
    try {
      // Fetch potato count
      const count = await contract.potatoCount();
      setPotatoCount(count.toNumber());

      // Fetch players of selected potato
      if (selectedPotato) {
        const playerAddresses = await contract.getPlayers(selectedPotato);
        setPlayers(playerAddresses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openGame = async () => { 
    try {
      await contract.openGame();
      fetchPotatoData(contract);
    } catch (error) {
      console.error(error);
    }
  };

  const joinGame = async () => {
    try {
      if (selectedPotato) {
        await contract.join(selectedPotato);
        fetchPotatoData(contract);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="App">
      <h1>Potato Game</h1>
      <p>Potato Count: {potatoCount}</p>
      <div>
        <button onClick={openGame}>Get New Potato</button>
        <label htmlFor="potatoSelect">Select Potato:</label>
        <select
          id="potatoSelect"
          onChange={(e) => setSelectedPotato(e.target.value)}
        >
          <option value="">Select</option>
          {/* Render the available potatoes dynamically */}
          {[...Array(potatoCount)].map((_, index) => (
            <option key={index} value={index + 1}>
              Potato {index + 1}
            </option>
          ))}
        </select>
        <button onClick={joinGame} disabled={!selectedPotato}>
          Join Potato
        </button>
      </div>
      {selectedPotato && (
        <div>
          <h2>Players in Potato {selectedPotato}</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;