import publicEntryInfo from "./publicEntryInfo";
import loanDBInfo from "./loanDBInfo";
import heartTokenInfo from "./heartTokenInfo";
import walletInfo from "./walletInfo";
//https://ethereum.stackexchange.com/questions/29044/dynamically-calling-a-function-on-a-contract
//https://stackoverflow.com/questions/3914557/passing-arguments-forward-to-another-javascript-function

// @notice dynamic call contract function that is able to call various parameters and handle parameters
// @return corresponding output
export const callContract = (contract, func, ...params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const output = await contract.methods[func](...params).call();
      resolve(output);
    } catch (error) {
      reject(error);
    }
  });
};

// @notice dynamic send contract function that is able to handle parameters
// @return corresponding result object
export const sendContract = (contract, func, ...params) => {
  return new Promise(async (resolve, reject) => {
    try {
      await contract.methods[func](...params)
        .send()
        .once("receipt", async result => {
          console.log(result);
          resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });
};
export const sendContractPayable = (contract, func, amount, ...params) => {
  return new Promise(async (resolve, reject) => {
    console.log(amount);
    try {
      await contract.methods[func](...params)
        .send({ value: amount })
        .once("receipt", async result => {
          console.log(result);
          resolve(result);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// @notice Proxy contract, functions that change state.
export const requestLoan = amount => {
  return new Promise((resolve, reject) => {
    sendContract(publicEntryInfo, "postRequest", amount)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const lendLoan = (debtNo, amount) => {
  return new Promise((resolve, reject) => {
    sendContractPayable(publicEntryInfo, "lendLoan", amount, debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const payLoan = (debtNo, amount) => {
  return new Promise((resolve, reject) => {
    sendContractPayable(publicEntryInfo, "payLoan", amount, debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const burnToken = amount => {
  return new Promise((resolve, reject) => {
    sendContract(publicEntryInfo, "burnToken", amount)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const withDraw = amount => {
  return new Promise((resolve, reject) => {
    sendContract(publicEntryInfo, "withDraw", amount)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// @notice LoanDB contract, functions that get state.

export const checkHaveDebt = address => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "checkHaveDebt", address)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getLenderofDebt = debtNo => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getLenderofDebt", debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getBorrowerofDebt = debtNo => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getBorrowerofDebt", debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
export const getAmountofDebt = debtNo => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getAmountofDebt", debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
export const getInterestofDebt = debtNo => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getInterestofDebt", debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
export const getStateofDebt = debtNo => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getStateofDebt", debtNo)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getDebtHistory = address => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getDebtHistory", address)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getLendHistory = address => {
  return new Promise((resolve, reject) => {
    callContract(loanDBInfo, "getLendHistory", address)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

// @notice Heart token contract. Get state functions.

export const getTokenBalance = address => {
  return new Promise((resolve, reject) => {
    callContract(heartTokenInfo, "balanceOf", address)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getWalletBalance = address => {
  return new Promise((resolve, reject) => {
    callContract(walletInfo, "depositsOf", address)
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
