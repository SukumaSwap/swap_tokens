import React from "react";

const TokenModal = ({ tokens, closeModal, selectToken }) => {
  return (
    <div className="modal" id="token_modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select a Token</h5>
            <button
              id="modal_close"
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div id="token_list">
              {tokens.map((token) => (
                <div className="token_row" key={token.symbol} onClick={() => selectToken(token)}>
                  <img className="token_list_img" src={token.logoURI} alt={token.symbol} />
                  <span className="token_list_text">{token.symbol}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenModal;
