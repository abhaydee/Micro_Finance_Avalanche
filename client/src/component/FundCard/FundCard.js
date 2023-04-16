import React from "react";
import "./FundCard.scss";
import ExpandIcon from "../../assets/image/expand.svg";
import { convertWeiToEther, convertWeiToUSD } from "../../scripts/utility";
function FundCard(props) {
  return (
    <div className="fund_item">
      <div className="fund_item_title">
        <span>{props.name}</span>
        <img src={ExpandIcon} alt="expand" onClick={props.openModel} />
      </div>
      <div className="fund_item_reason">
        <span>Reason: </span>
        <p>{props.reason}</p>
      </div>
      <div className="fund_item_money">
        <span>
          {convertWeiToEther(props.value)} Ether (
          {convertWeiToUSD(props.value, props.usdRate)} USD)
        </span>
      </div>
      <button
        className="fund_item_btn"
        onClick={() => props.lend(props.id, props.value)}
      >
        <span>lend</span>
      </button>
    </div>
  );
}

export default FundCard;
