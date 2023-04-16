import React from "react";
import "./CouponItem.scss";
function CouponItem(props) {
  return (
    <div className="coupon_item">
      <img src={props.image} alt="item-background" />
      <p className="coupon_item__title">{props.id}</p>
      <p className="coupon_item__description">{props.title}</p>
      <div className="coupon_item__button">
        <p>{props.amount} Heart Token</p>
        <button
          className="btn btn--blue"
          disabled={!props.canBeRedeemed}
          onClick={() => props.getCode(props.id, props.amount)}
        >
          Redeem
        </button>
      </div>
    </div>
  );
}

export default CouponItem;
