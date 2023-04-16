import React from "react";
import BackDrop from "../BackDrop/BackDrop";
import LoadingIcon from "../../assets/image/loading-heart.svg";
function Loading() {
  return (
    <BackDrop show="true">
      <img src={LoadingIcon} alt="spinner" className="spinner" />
    </BackDrop>
  );
}

export default Loading;
