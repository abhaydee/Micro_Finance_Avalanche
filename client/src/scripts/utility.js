import web3 from "web3";
import Decimal from "decimal.js";
import React from "react";
import NumberFormat from "react-number-format";
export const updateObject = (oldObject, updatedValues) => {
  return {
    ...oldObject,
    ...updatedValues
  };
};

export const generateString = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const convertWeiToEther = amount => {
  return amount === 0 ? 0 : web3.utils.fromWei(amount, "ether");
};

export const convertWeiToUSD = (amount, rate) => {
  const ether = convertWeiToEther(amount);
  const usdAmount = new Decimal(ether).mul(new Decimal(rate));
  return usdAmount.toString();
};

export const convertEtherToWei = amount => {
  return !amount ? 0 : web3.utils.toWei(amount, "ether");
};

export function USDFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}
export function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

export function PhoneFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
      format="+1 (###) ###-####"
      mask="_"
    />
  );
}

export function PhoneTextFormatCustom(props) {
  const { ...other } = props;

  return (
    <NumberFormat
      {...other}
      displayType={"text"}
      format="+1 (###) ###-####"
      mask="_"
    />
  );
}
