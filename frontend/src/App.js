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
  const [curPlayer, setCurPlayer] = useState("");
  const [potatoCount, setPotatoCount] = useState(0);
  const [selectedPotato, setSelectedPotato] = useState(null);
  const [heldPotato, setHeldPotato] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [sendPlayer, setSendPlayer] = useState("");
  const [isExploded, setExploded] = useState(false);
 
  const connect = async () => {
    const { ethereum } = window;
    console.log("Connecting...");

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);

      const accounts = await provider.send("eth_requestAccounts", []);
      setCurPlayer(accounts[0]);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(address, data.abi, signer);

      // Set up event listeners
      contract.on("openedGame", (player, potatoId, potatoCount, playerAddresses) => {
        console.log(`Game opened: + ${player} + ${potatoId} + ${potatoCount}`);
        // Perform any actions you want when the "openedGame" event is emitted
        // For example, you can call fetchPotatoData to update the potatoCount
        setSelectedPotato(potatoId);
        setHeldPotato(potatoId);
        fetchPotatoData();
      });

      contract.on("joinedGame", (player, potatoId, potatoCount, playerAddresses) => {
        console.log(`Game joined: + ${player} + ${potatoId} + ${potatoCount}`);
        // Perform any actions you want when the "joinedGame" event is emitted
        // For example, you can call fetchPotatoData to update the player list
        setSelectedPotato(potatoId);
        fetchPotatoData();
      });
      
      contract.on("gameStarted", (potatoId) => {
        console.log(`Game started: ${potatoId}`);
        // Perform any actions you want when the "joinedGame" event is emitted
        // For example, you can call fetchPotatoData to update the player list
        if (potatoId === selectedPotato) {
          setGameStarted(true);
        }
        fetchPotatoData();
      });

      contract.on("potatoSent", (from, to, potatoId) => {
        console.log(`Potato sent: + ${from} + ${to} + ${potatoId}`);
        // Perform any actions you want when the "joinedGame" event is emitted
        // For example, you can call fetchPotatoData to update the player list
        fetchPotatoData();
      });

      contract.on("potatoExploded", (from, to, potatoId) => {
        console.log(`Potato exploded: + ${from} + ${to} + ${potatoId}`);
        // Perform any actions you want when the "joinedGame" event is emitted
        // For example, you can call fetchPotatoData to update the player list
        setExploded(true);
        fetchPotatoData();
      });

      setContract(contract);

      console.log(`Connected: ${curPlayer}`);
      fetchPotatoData(contract);
    } else {
     console.log("No wallet (e.g. MetaMask) detected!");
    }
  };

  const fetchPotatoData = async () => { 
    try {
      if (contract) {
        // Fetch potato count
        console.log(`Fetching... ${contract}`);

        const count = await contract.potatoCount();
        console.log(`${count}`)
        setPotatoCount(count);

        // Fetch players of selected potato
        if (selectedPotato) {
          const playerAddresses = await contract.getPlayersForPotato(selectedPotato);
          setPlayers(playerAddresses);
        }
      }
      
    } catch (error) {
      console.error(error);
    }
  };

  const setSelectedPotatoWithFetch = async (potato) => {
    try {
      setSelectedPotato(potato);
      await fetchPotatoData();
    } catch (error) {
      console.error(error);
    }
  };
  

  const openGame = async () => { 
    try {
      await contract.openGame();
      fetchPotatoData();
      console.log(`OG: Hi. ${potatoCount}`);
    } catch (error) {
      console.error(error);
    }
  };

  const joinGame = async () => {
    try {
      if (selectedPotato) {
        await contract.joinGame(selectedPotato);
        fetchPotatoData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const sendPotato = async () => {
    try {
      if (sendPlayer) {
        console.log(`${curPlayer} -> ${sendPlayer} : ${selectedPotato}`);
        await contract.transferFrom(curPlayer, sendPlayer, selectedPotato);
        fetchPotatoData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const setPlayerTo = async (player) => {
    try {
      setSendPlayer(player);
      await fetchPotatoData();
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="App">
      <h1>토다메감자 TodameGamja</h1>
      <p>Potato Count: {potatoCount}</p>
      <p>Current Player: {curPlayer}</p>
      <button onClick={connect}>CONNECT</button>
      <div>
        <button onClick={openGame}>Get New Potato</button>
        <label htmlFor="potatoSelect">Select Potato:</label>
        <select
          id="potatoSelect"
          onChange={(e) => setSelectedPotatoWithFetch(e.target.value)}
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
      <div>
        <select
          id="playerSelect"
          onChange={(e) => setPlayerTo(e.target.value)}
        >
          <option value="">Select</option>
          {/* Render the available players dynamically */}
          {[...Array(players.length)].map((_, index) => (
            <option key={index} value={players[index]}>
              Player {players[index]}
            </option>
          ))}
        </select>
        <button onClick={sendPotato}>Send Potato</button>
      <div>
        Holding a Potato: {heldPotato}
      </div>
      </div>
      {isExploded && <h1>EXPLODED!</h1>}
      {selectedPotato && (
        <div>
          {/* <h2>Players in Potato {selectedPotato}</h2> */}
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