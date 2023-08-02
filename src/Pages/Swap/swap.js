import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import qs from 'qs';

const SwapDemo = () => {
  const [currentTrade, setCurrentTrade] = useState({});
  const [currentSelectSide, setCurrentSelectSide] = useState('');
  const [tokens, setTokens] = useState([]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [gasEstimate, setGasEstimate] = useState('');

  const privatekey = process.env.PRIVATE_KEY; // Make sure to set the PRIVATE_KEY in the environment

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await listAvailableTokens();
  };

  const listAvailableTokens = async () => {
    console.log("initializing");
    const response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
    const tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    setTokens(tokenListJSON.tokens);
    console.log("tokens: ", tokenListJSON.tokens);
  };

  const selectToken = (token) => {
    closeModal();
    setCurrentTrade(prevState => ({
      ...prevState,
      [currentSelectSide]: token,
    }));
    console.log("currentTrade: ", currentTrade);
    renderInterface();
  };

  const renderInterface = () => {
    if (currentTrade.from) {
      console.log(currentTrade.from);
      // Set the UI state for the selected from token
      document.getElementById("from_token_img").src = currentTrade.from.logoURI;
      document.getElementById("from_token_text").innerHTML =
        currentTrade.from.symbol;
    }
    if (currentTrade.to) {
      console.log(currentTrade.to);
      // Set the UI state for the selected to token
      document.getElementById("to_token_img").src = currentTrade.to.logoURI;
      document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
  
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("connecting");
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
      document.getElementById("login_button").innerHTML = "Connected";
      // const accounts = await ethereum.request({ method: "eth_accounts" });
      document.getElementById("swap_button").disabled = false;
    } else {
      document.getElementById("login_button").innerHTML = "Please install MetaMask";
    }
  };

  const openModal = (side) => {
    setCurrentSelectSide(side);
    document.getElementById("token_modal").style.display = "block";
  };

  const closeModal = () => {
    document.getElementById("token_modal").style.display = "none";
  };

  const getPrice = async () => {
    console.log("Getting Price");
    if (!currentTrade.from || !currentTrade.to || !fromAmount) return;
    let amount = Number(fromAmount * 10 ** currentTrade.from.decimals);

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: amount,
    };

    const headers = { '0x-api-key': privatekey }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

    // Fetch the swap price.
    const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`, { headers });
    const swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);

    setToAmount(swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals));
    setGasEstimate(swapPriceJSON.estimatedGas);
  };

  // ... (Continue with other functions, or provide placeholders for them)

  return (
    <div>
      {/* The rest of the HTML and UI elements go here */}
    </div>
  );
};

export default SwapDemo;
