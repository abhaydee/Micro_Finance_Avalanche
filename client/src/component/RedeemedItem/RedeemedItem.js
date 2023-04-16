import React from "react";
import "./RedeemedItem.scss";
function RedeemedItem(props) {
  return (
    <div className="redeemed_item">
      <img src={props.image} alt="item-background" />
      <p className="redeemed_item__title">{props.id}</p>
      <p className="redeemed_item__description">{props.code}</p>
    </div>
  );
}

export default RedeemedItem;
