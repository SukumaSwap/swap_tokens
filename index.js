// const BigNumber = require('bignumber.js');
const web3 = require('web3');
const qs = require('qs');

let currentTrade = {};
let currentSelectSide;
let tokens;

    
const privatekey= process.env.PRIVATE_KEY;

async function init() {
    await listAvailableTokens();
}

async function listAvailableTokens(){
    console.log("initializing");
    let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    tokens = tokenListJSON.tokens;
    console.log("tokens: ", tokens);

    // Create token list for modal
    let parent = document.getElementById("token_list");
    for (const i in tokens){
        // Token row in the modal token list
        let div = document.createElement("div");
        div.className = "token_row";
        let html = `
        <img class="token_list_img" src="${tokens[i].logoURI}">
          <span class="token_list_text">${tokens[i].symbol}</span>
          `;
        div.innerHTML = html;
        div.onclick = () => {
            selectToken(tokens[i]);
        };
        parent.appendChild(div);
    };
}

async function selectToken(token){
    closeModal();
    currentTrade[currentSelectSide] = token;
    console.log("currentTrade: ", currentTrade);
    renderInterface();
}

function renderInterface(){
    if (currentTrade.from){
        console.log(currentTrade.from)
        document.getElementById("from_token_img").src = currentTrade.from.logoURI;
        document.getElementById("from_token_text").innerHTML = currentTrade.from.symbol;
    }
    if (currentTrade.to){
        console.log(currentTrade.to)
        document.getElementById("to_token_img").src = currentTrade.to.logoURI;
        document.getElementById("to_token_text").innerHTML = currentTrade.to.symbol;
    }
}

async function connect() {
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
}

function openModal(side){
    currentSelectSide = side;
    document.getElementById("token_modal").style.display = "block";
}

function closeModal(){
    document.getElementById("token_modal").style.display = "none";
}

async function getPrice(){
    console.log("Getting Price");
  
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
    }
    const headers = {'0x-api-key': privatekey}; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
  
    // Fetch the swap price.
    const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`, { headers });
    
    swapPriceJSON = await response.json();
    console.log("Price: ", swapPriceJSON);
    
    document.getElementById("to_amount").value = swapPriceJSON.buyAmount / (10 ** currentTrade.to.decimals);
    document.getElementById("gas_estimate").innerHTML = swapPriceJSON.estimatedGas;
}
//function to getquote,only diffrence from getprice is mst be passed in taker address
async function getQuote(account){
    console.log("Getting Quote");
  
    if (!currentTrade.from || !currentTrade.to || !document.getElementById("from_amount").value) return;
    let amount = Number(document.getElementById("from_amount").value * 10 ** currentTrade.from.decimals);
  
    const params = {
        sellToken: currentTrade.from.address,
        buyToken: currentTrade.to.address,
        sellAmount: amount,
        takerAddress: account,
    }

    const headers = {'0x-api-key': privatekey }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)
  
    // Fetch the swap quote.
    const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers });
    
    swapQuoteJSON = await response.json();
    console.log("Quote: ", swapQuoteJSON);
    
    document.getElementById("to_amount").value = swapQuoteJSON.buyAmount / (10 ** currentTrade.to.decimals);
    document.getElementById("gas_estimate").innerHTML = swapQuoteJSON.estimatedGas;
  
    return swapQuoteJSON;
}

async function trySwap(){
    let accounts=await ethereum.request( {method:"eth_accounts"});
    let takerAddress=accounts[0];
    console.log("takerAddress:",takerAddress);
    const swapQuoteJSON= await getQuote(takerAddress);
//setting token allowance
const web3 = new Web3(Web3.givenProvider); //connecting to etheteum:metamask && only work if metamask connected
//iteracting with ERC20TokenContract
const fromTokenAddress = currentTrade.from.address;
const erc20abi=[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ];
const ERC20TokenContract = new web3.eth.Contract(erc20abi, fromTokenAddress);
console.log('ERC20TokenContract:',ERC20TokenContract) ;
//setting allowance target i.e exhange i.e OXapi proxy address
const maxApproval =new BigNumber(2).pow(256).minus(1);
// Grant the allowance target an allowance to spend our tokens.
const tx= ERC20TokenContract.methods.approve(
    swapQuoteJSON.allowanceTargt,
    maxApproval,
) .send({ from: takerAddress })
.then(tx => {
    console.log("tx: ", tx)
});

}

init();

document.getElementById("login_button").onclick = connect;
document.getElementById("from_token_select").onclick = () => {
    openModal("from");
};
document.getElementById("to_token_select").onclick = () => {
    openModal("to");
};
document.getElementById("modal_close").onclick = closeModal;
document.getElementById("from_amount").onblur = getPrice;
document.getElementById("from_amount").onblur = trySwap;