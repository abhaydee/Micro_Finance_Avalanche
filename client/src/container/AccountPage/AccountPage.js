import React, { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Loading from "../../component/Loading/Loading";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { database } from "../../firebase/FireBaseRef.js";
import { connect } from "react-redux";
import Decimal from "decimal.js";
import {
  convertWeiToUSD,
  convertWeiToEther,
  convertEtherToWei,
  NumberFormatCustom,
  USDFormatCustom,
  PhoneFormatCustom,
  PhoneTextFormatCustom
} from "../../scripts/utility";
import {
  requestLoan,
  getStateofDebt,
  getLenderofDebt,
  getInterestofDebt,
  payLoan,
  getWalletBalance,
  getLendHistory,
  getBorrowerofDebt,
  withDraw,
  getAmountofDebt
} from "../../blockchain/contractInteract";
import * as actions from "../../store/actions/index";
import Swal from "sweetalert2";
import "./AccountPage.scss";
function AccountPage(props) {
  const { infor, address, onSetInfor, reduxLoading, usdRate } = props;
  const [information, setInformation] = useState({
    name: "",
    address: "",
    phone: ""
  });
  const [debt, setDebt] = useState({
    amount: "",
    reason: "",
    state: -1,
    lender: ""
  });
  const [walletBalance, setWalletBalance] = useState("2");
  const [loading, setLoading] = useState(false);
  const [debtors, setDebtors] = useState([
    {phone:"+18577468097",
    name :"Abhay",
    "address":"13 Tabor Place",
    "userAddress":"0x27e1B0ccda6B73a96ab1a414e9E50c4bb5F05782"
  },
  {phone:"+18577468097",
    name :"Teja Reddy",
    "address":"13 Tabor Place",
    "userAddress":"0x27e1B0ccda6B73a96ab1a414e9E50c4bb5F05782"
  },
  ]);
  const handleChangeInfor = input => event => {
    const updatedProfile = { ...information };
    updatedProfile[input] = event.target.value;
    setInformation(updatedProfile);
  };
  const handleChangeDebt = input => event => {
    const updatedProfile = { ...debt };
    updatedProfile[input] = event.target.value;
    setDebt(updatedProfile);
  };
  useEffect(() => {
    // Load all day including current debt, information, debtors list
    const debtData = database.ref("debt");
    const inforData = database.ref("infor");
    let result;
    debtData
      .orderByChild("borrower")
      .equalTo(address)
      .on("child_added", async function(snapshot) {
        const state = await getStateofDebt(snapshot.val().debtNo);
        const amount = await getAmountofDebt(snapshot.val().debtNo);
        if (parseInt(state) === 0) {
          result = {
            amount: convertWeiToEther(amount),
            reason: snapshot.val().reason,
            state: 0,
            lender: "",
            debtNo: snapshot.val().debtNo
          };
          setDebt(result);
        } else if (parseInt(state) === 1) {
          const lender = await getLenderofDebt(snapshot.val().debtNo);
          const interest = await getInterestofDebt(snapshot.val().debtNo);
          result = {
            amount: convertWeiToEther(amount),
            reason: snapshot.val().reason,
            lender: lender,
            interest: convertWeiToEther(interest),
            state: 1,
            debtNo: snapshot.val().debtNo
          };
          setDebt(result);
        }
      });
    getWalletBalance(address).then(result => {
      setWalletBalance(result);
    });
    getLendHistory(address).then(async result => {
      let list = [];
      for (let i = 0; i < result.length; i++) {
        let state = await getStateofDebt(result[i]);
        if (parseInt(state) === 1) {
          let borrowerAddr = await getBorrowerofDebt(result[i]);
          let getBorrowerInfo = async () =>
            await inforData
              .orderByChild("userAddr")
              .equalTo(borrowerAddr)
              .once("value");
          let borrowerInfo = await getBorrowerInfo();
          for (let userKey in borrowerInfo.val()) {
            list.push({
              userAddress: borrowerAddr,
              name: borrowerInfo.val()[userKey].name,
              address: borrowerInfo.val()[userKey].address,
              phone: borrowerInfo.val()[userKey].phone
            });
          }
        }
      }
      // setDebtors(list);
    });
  }, [address]);
  useEffect(() => {
    if (infor) {
      setInformation(infor);
    }
  }, [infor]);
  const validUpdateInfo =
    information.name !== infor.name ||
    information.address !== infor.address ||
    information.phone !== infor.phone;
  const updateInfo = () => {
    setLoading(true);
    onSetInfor({ ...information, userAddr: infor.userAddr, key: infor.key });
    database.ref("infor/" + infor.key).set(
      {
        ...information,
        userAddr: infor.userAddr
      },
      function(error) {
        setLoading(false);
        if (error) {
          // The write failed...
        } else {
          // Data saved successfully!
        }
      }
    );
  };
  const requestDebt = async () => {
    setLoading(true);
    try {
      const result = await requestLoan(convertEtherToWei(debt.amount));
      console.log("the result", result)
      const debtNo = result.transactionHash.slice(0, 64);
      const data = {
        amount: debt.amount,
        reason: debt.reason,
        borrower: address,
        debtNo: debtNo
      };
      database.ref("debt").push(data);
      data.state = 0;
      setDebt(data);
      Swal.fire({
        icon: "success",
        title: "You requested successfully"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message
      });
    }
    setLoading(false);
  };
  const payDebt = async () => {
    setLoading(true);
    const amount = new Decimal(convertEtherToWei(debt.amount)).plus(
      new Decimal(convertEtherToWei(debt.interest))
    );
    try {
      await payLoan(debt.debtNo, amount.toString());
      Swal.fire({
        icon: "success",
        title: "You paid successfully",
        text: "Reward 10 Heart Token"
      });
      setLoading(false);
      setDebt({ amount: "", reason: "", state: -1, lender: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message
      });
      setLoading(false);
    }
  };
  const withDrawWallet = async () => {
    setLoading(true);
    try {
      const receipt = await withDraw(walletBalance);
      console.log(receipt);
      getWalletBalance(address).then(result => {
        setWalletBalance(result);
      });
      Swal.fire({
        icon: "success",
        title: "Withdrawed successfully",
        text: `Your withdrawed amount is ${convertWeiToEther(
          walletBalance
        )} Ether`
      });
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message
      });
      setLoading(false);
    }

    setLoading(false);
  };
  return (
    <div className="account">
      {(reduxLoading || loading) && <Loading />}
      <Grid container spacing={3} className="account__container">
        <Grid item lg={6} xs={12}>
          <Paper className="account__infor">
            <h2>Information</h2>
            <TextField
              label="Name"
              variant="outlined"
              className="account__input"
              value={information.name}
              onChange={handleChangeInfor("name")}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              className="account__input"
              value={information.phone}
              onChange={handleChangeInfor("phone")}
              InputProps={{
                inputComponent: PhoneFormatCustom
              }}
            />
            <TextField
              label="Address"
              variant="outlined"
              className="account__input"
              value={information.address}
              onChange={handleChangeInfor("address")}
            />
            <Button
              variant="contained"
              className="account__btn"
              disabled={!validUpdateInfo}
              onClick={updateInfo}
            >
              Update
            </Button>
          </Paper>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Paper className="account__request">
            <h2>{!!debt.lender ? "Request" : "Debt"}</h2>
            <div className="account__request_amount">
              <TextField
                label="Eth"
                variant="outlined"
                className="account__input"
                value={debt.amount}
                onChange={handleChangeDebt("amount")}
                disabled={debt.state !== -1}
                InputProps={{
                  inputComponent: NumberFormatCustom
                }}
                error={debt.amount >= 60}
                helperText={debt.amount >= 60 && "Too much Ether."}
              />
              <TextField
                label="USD"
                variant="outlined"
                className="account__input"
                value={convertWeiToUSD(convertEtherToWei(debt.amount), usdRate)}
                disabled
                InputProps={{
                  inputComponent: USDFormatCustom
                }}
              />
            </div>

            <TextField
              label="Reason"
              variant="outlined"
              className="account__input"
              value={debt.reason}
              onChange={handleChangeDebt("reason")}
              disabled={debt.state !== -1}
            />
            {!!debt.lender && (
              <React.Fragment>
                <TextField
                  label="Interest"
                  variant="outlined"
                  className="account__input"
                  value={debt.interest}
                  onChange={handleChangeDebt("interest")}
                  disabled
                />
                <TextField
                  label="Lender"
                  variant="outlined"
                  className="account__input"
                  value={debt.lender}
                  onChange={handleChangeDebt("lender")}
                  disabled
                />
              </React.Fragment>
            )}
            <Button
              variant="contained"
              className="account__btn"
              onClick={debt.state === -1 ? requestDebt : payDebt}
              disabled={
                debt.state === 0 ||
                debt.amount >= 60 ||
                debt.reason.length === 0
              }
            >
              {debt.state === 0
                ? "Requested"
                : debt.state === 1
                ? "Pay"
                : "Submit"}
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className="account">
            <h2>
              Wallet:&nbsp;
              <span>
                {convertWeiToEther("1000")} ETH (
                {convertWeiToUSD("1000", usdRate)} USD)
              </span>
              <Button
                variant="contained"
                className="account__btn--pay"
                onClick={withDrawWallet}
              >
                Withdraw
              </Button>
            </h2>
            <Divider />
            <h2>
              {debtors.length === 0 ? (
                "No Debtors"
              ) : (
                <div>
                  <h2>Debtors</h2>
                  <TableContainer component={Paper}>
                    <Table className="debtors-table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Phone</TableCell>
                          <TableCell align="right">Address</TableCell>
                          <TableCell align="right">Eth Address</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debtors.map(debtor => (
                          <TableRow key={debtor.userAddress}>
                            <TableCell component="th" scope="row">
                              {debtor.name}
                            </TableCell>
                            <TableCell align="right">
                              <PhoneTextFormatCustom
                                value={debtor.phone}
                                renderText={value => <span>{value}</span>}
                              />
                            </TableCell>
                            <TableCell align="right">
                              {debtor.address}
                            </TableCell>
                            <TableCell align="right">
                              {debtor.userAddress}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </h2>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    address: state.address,
    infor: state.infor,
    reduxLoading: state.loading,
    error: state.error,
    authRedirectPath: state.authRedirectPath,
    usdRate: state.usdRate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetInfor: infor => dispatch(actions.getInfor(infor))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
