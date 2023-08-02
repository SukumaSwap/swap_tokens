import React from "react";

const SwapForm = ({
  currentTrade,
  fromTokenImg,
  fromTokenText,
  toTokenImg,
  toTokenText,
  fromAmount,
  toAmount,
  gasEstimate,
  handleChangeFromAmount,
  handleSwap,
  handleSelectFromToken,
  handleSelectToToken,
  handleOpenModal,
}) => {
  return (
    <div className="col col-md-6 offset-md-3" id="window">
      <h4>Swap</h4>
      <div id="form">
        <div className="swapbox">
          <div
            className="swapbox_select token_select"
            id="from_token_select"
            onClick={handleSelectFromToken}
          >
            <img className="token_img" src={fromTokenImg} alt={fromTokenText} />
            <span id="from_token_text">{fromTokenText}</span>
          </div>
          <div className="swapbox_select">
            <input
              className="number form-control"
              placeholder="amount"
              id="from_amount"
              value={fromAmount}
              onChange={handleChangeFromAmount}
            />
          </div>
        </div>
        <div className="swapbox">
          <div
            className="swapbox_select token_select"
            id="to_token_select"
            onClick={handleSelectToToken}
          >
            <img className="token_img" src={toTokenImg} alt={toTokenText} />
            <span id="to_token_text">{toTokenText}</span>
          </div>
          <div className="swapbox_select">
            <input
              className="number form-control"
              placeholder="amount"
              id="to_amount"
              value={toAmount}
              readOnly
            />
          </div>
        </div>
        <div className="gas_estimate_label">
          Estimated Gas: <span id="gas_estimate">{gasEstimate}</span>
        </div>
        <button
          disabled={!currentTrade.from || !currentTrade.to || !fromAmount}
          className="btn btn-large btn-primary btn-block"
          id="swap_button"
          onClick={handleSwap}
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export default SwapForm;
