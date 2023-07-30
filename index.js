//global variables
let currentTrade={};
let currentSelectedSide;
let tokens;

async function init() {
    await listAvailableTokens();
  }
  
  async function listAvailableTokens(){
    console.log("initializing");
    let response = await fetch('https://tokens.coingecko.com/uniswap/all.json');
    let tokenListJSON = await response.json();
    console.log("listing available tokens: ", tokenListJSON);
    console.log(tokenListJSON);
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
        parent.appendChild(div);
    }
};
//fetch token selected
// selectedToken(tokens[i]);

async function selectedToken(token){
closeModal();
currentTrade[currentSelectedSide]=token;
console.log("currentTrade",currentTrade);
}
 
//function to render token
function renderInterface(){
    if(currentTrade.from){
        document.getElementById("from_token_img").src=currentTrade.from.logoURI;
        document.getElementById("from_text_text").innerHTML=currentTrade.from.symbol;
        }
        if(currentTrade.to){
            document.getElementById("to_token_img").src=currentTrade.to.logoURI;
            document.getElementById("to_token_img").src=currentTrade.to.logoURI;
}  
};

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
        document.getElementById("login_button").innerHTML =
            "Please install MetaMask";
        }
    }
  
    
  
    function openModal(side){
        currentSelectedSide=side;
        document.getElementById("token_modal").style.display = "block";
    }
  
    function closeModal(){
    document.getElementById("token_modal").style.display = "none";
    }
  
    init();

    document.getElementById("login_button").onclick = connect;
    document.getElementById("from_token_select").onclick = () => {openModal("from")};
    document.getElementById("modal_close").onclick = closeModal;
  