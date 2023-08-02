import React, { useState, useEffect } from "react";
import TokenModal from "./TokenModal";
import SwapForm from "./SwapForm";
import { erc20abi } from "./abi";
import BigNumber from "bignumber.js";
import web3 from "web3";
import qs from "qs";

const privatekey = process.env.PRIVATE_KEY; // Make sure to set the environment variable.

const Swap = () => {
  const [currentTrade, setCurrentTrade] = useState({});
  const [currentSelectSide, setCurrentSelectSide] = useState(null);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await listAvailableTokens();
  };

  const listAvailableTokens = async () => {
    console.log("initializing");
    const response = await fetch(
      "https://tokens.coingecko.com/uniswap/all.json"
    );
    const tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    setTokens(tokenListJSON.tokens);
    console.log("tokens: ", tokens);
  };

  const selectToken = (token) => {
    closeModal();
    setCurrentTrade({ ...currentTrade, [currentSelectSide]: token });
    console.log("currentTrade: ", currentTrade);
    renderInterface();
  };

  const renderInterface = () => {
    if (currentTrade.from) {
      document.getElementById("from_token_img").src = currentTrade.from.logoURI;
      document.getElementById("from_token_text").innerHTML =
        currentTrade.from.symbol;
    }
    if (currentTrade.to) {
      document.getElementById("to_token_img").src = currentTrade.to.logoURI;
      document.getElementById("to_token_text").innerHTML =
        currentTrade.to.symbol;
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("connecting");
        // await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
      document.getElementById("login_button").innerHTML = "Connected";
      document.getElementById("swap_button").disabled = false;
    } else {
      document.getElementById("login_button").innerHTML =
        "Please install MetaMask";
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

    if (
      !currentTrade.from ||
      !currentTrade.to ||
      !document.getElementById("from_amount").value
    )
      return;
    let amount = Number(
      document.getElementById("from_amount").value *
        10 ** currentTrade.from.decimals
    );

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: amount,
    };

    const headers = { "0x-api-key": privatekey }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

    // Fetch the swap price.
    const response = await fetch(
      `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
      { headers }
    );

    const swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);

    document.getElementById("to_amount").value =
      swapPriceJSON.buyAmount / 10 ** currentTrade.to.decimals;
    document.getElementById("gas_estimate").innerHTML =
      swapPriceJSON.estimatedGas;
  };

  const getQuote = async (account) => {
    console.log("Getting Quote");

    if (
      !currentTrade.from ||
      !currentTrade.to ||
      !document.getElementById("from_amount").value
    )
      return;
    let amount = Number(
      document.getElementById("from_amount").value *
        10 ** currentTrade.from.decimals
    );

    const params = {
      sellToken: currentTrade.from.address,
      buyToken: currentTrade.to.address,
      sellAmount: amount,
      takerAddress: account,
    };

    const headers = { "0x-api-key": privatekey }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

    // Fetch the swap quote.
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      { headers }
    );

    const swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);

    document.getElementById("to_amount").value =
      swapQuoteJSON.buyAmount / 10 ** currentTrade.to.decimals;
    document.getElementById("gas_estimate").innerHTML =
      swapQuoteJSON.estimatedGas;

    return swapQuoteJSON;
  };

  const trySwap = async () => {
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];
    console.log("takerAddress:", takerAddress);
    const swapQuoteJSON = await getQuote(takerAddress);
    // ... (remaining code for swap)
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {/* ... */}
      </nav>
      <div className="container">
        <div className="row">
          <SwapForm
            currentTrade={currentTrade}
            fromTokenImg={currentTrade.from?.logoURI}
            fromTokenText={currentTrade.from?.symbol}
            toTokenImg={currentTrade.to?.logoURI}
            toTokenText={currentTrade.to?.symbol}
            fromAmount={document.getElementById("from_amount")?.value}
            toAmount={document.getElementById("to_amount")?.value}
            gasEstimate={document.getElementById("gas_estimate")?.innerText}
            handleChangeFromAmount={getPrice}
            handleSwap={trySwap}
            handleSelectFromToken={() => openModal("from")}
            handleSelectToToken={() => openModal("to")}
            handleOpenModal={openModal}
          />
        </div>
      </div>
      <TokenModal
        tokens={tokens}
        closeModal={closeModal}
        selectToken={selectToken}
      />
    </>
  );
};

export default Swap;
