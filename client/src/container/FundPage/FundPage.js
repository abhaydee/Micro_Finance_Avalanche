import React, { useState, useEffect, useCallback } from "react";
import FundCard from "../../component/FundCard/FundCard";
import HeartIcon from "../../assets/image/heart-icon.gif";
import { database } from "../../firebase/FireBaseRef";
import {
  getStateofDebt,
  getAmountofDebt,
  lendLoan,
  getBorrowerofDebt,
} from "../../blockchain/contractInteract";
import Popup from "../../component/Popup/Popup";
import Loading from "../../component/Loading/Loading";
import { connect } from "react-redux";
import "./FundPage.scss";
import Swal from "sweetalert2";

function FundPage(props) {
  const { address, usdRate } = props;
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  const [pageNum, setPageNum] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([
    {
      address: "13 Tabor Place",
      debtNo:
        "0x3e05292c17c746cf7031f77517c6a026498482b231c192d81d252117004b78",
      name: "Abhay",
      phone: "+18577468097",
      reason: "For Dinner",
      userAddress: "0x27e1B0ccda6B73a96ab1a414e9E50c4bb5F05782",
      value: "1",
    },
    {
      address: "13 Tabor Place",
      debtNo:
        "0x3e05292c17c746cf7031f77517c6a026498482b231c192d81d252117004b78",
      name: "Teja",
      phone: "+18577468097",
      reason: "For Lunch and Dinner",
      userAddress: "0x27e1B0ccda6B73a96ab1a414e9E50c4bb5F05782",
      value: "1",
    },
    {
      address: "13 Tabor Place",
      debtNo:
        "0x3e05292c17c746cf7031f77517c6a026498482b231c192d81d252117004b78",
      name: "Lohith",
      phone: "+18577468097",
      reason: "For Truck Loads",
      userAddress: "0x27e1B0ccda6B73a96ab1a414e9E50c4bb5F05782",
      value: "1",
    },
    {
      address: "13 Tabor Place",
      debtNo:
        "0x3e05292c17c746cf7031f77517c6a026498482b231c192d81d252117004b78",
      name: "Jhanavi",
      phone: "",
      reason: "For Stationary",
      userAddress: "0x27e1B0ccda6B73a96ab1a414e9E50c4bb5F05782",
      value: "1",
    },

  ]);
  const [openPopup, setOpenPopup] = useState(false);
  const [inforDetail, setInforDetail] = useState({});
  const [tempData, setTempData] = useState([]);
  const maxPage = 8;

  // useEffect(() => {}, [currentPage]);
  const updateDebtList = useCallback(async () => {
    const getDebtDataBase = async () =>
      await database.ref("debt").once("value");
    const getInforDataBase = async (borrower) =>
      await database
        .ref("infor")
        .orderByChild("userAddr")
        .equalTo(borrower)
        .once("value");
    const tempData = [];
    let debtData = await getDebtDataBase();
    console.log("the debt data", debtData.val());
    let debtsList = debtData.val();
    for (let key in debtsList) {
      let borrower = await getBorrowerofDebt(debtsList[key].debtNo);
      console.log("borrower details", borrower);
      console.log("the address", address);

      let item = {
        debtNo: "",
        userAddress: "",
        reason: "",
        value: "",
        name: "",
        address: "",
        phone: "",
      };
      let state = await getStateofDebt(debtsList[key].debtNo);
      console.log(state);
      if (parseInt(state) === 0) {
        let amount = await getAmountofDebt(debtsList[key].debtNo);
        console.log(amount);
        item.value = amount;
        item.debtNo = debtsList[key].debtNo;
        item.userAddress = borrower;
        item.reason = debtsList[key].reason;
        console.log("the item", borrower);
        // let userData = await getInforDataBase(borrower);
        // console.log("the user data", userData.val())
        // for (let userKey in userData.val()) {
        item.name = "";
        item.address = address;
        item.phone = "";
        // }

        console.log("the item", item);
      }
    }
    console.log("asdasdasdasdasd");
    return tempData;
  });
  console.log("the temp data");
  useEffect(() => {
    setLoading(true);
    updateDebtList().then((result) => {
      setData(result);
      let numList = [];
      for (let i = 0; i < Math.ceil(result.length / maxPage); i++) {
        numList.push(i);
      }
      setPageNum(numList);
    });
    setLoading(false);
  }, [address, updateDebtList]);
  const changePage = (index) => {
    setCurrentPage(index);
  };
  const openInforDetail = (name, address, phone) => {
    console.log("hello");
    setInforDetail({ name, address, phone });
    setOpenPopup(true);
  };
  const closeInforDetail = () => {
    setInforDetail({});
    setOpenPopup(false);
  };
  const lendLoanAct = async (debtNo, amount) => {
    setLoading(true);
    await lendLoan(debtNo, amount);
    updateDebtList().then((result) => {
      setData(result);
      let numList = [];
      for (let i = 0; i < Math.ceil(result.length / maxPage); i++) {
        numList.push(i);
      }
      setPageNum(numList);
    });
    setLoading(false);
    Swal.fire({
      icon: "success",
      title: "You paid successfully",
      text: "Reward 10 Heart Token",
    });
  };

  console.log("the final data", data);
  return (
    <div className="fund">
      <div className="banner"></div>
      <div className="title">
        <img src={HeartIcon} alt="heart icon" className="title_image" />
        <p>Someone needs your help !!</p>
      </div>
      <div className="fund__content">
        <div className="fund-card">
          {
            data
              .slice(currentPage * maxPage, (currentPage + 1) * maxPage)
              .map((item, index) => (
                <div key={index}>
                <FundCard
                  name={item.name}
                  reason={item.reason}
                  value={item.value}
                  usdRate={usdRate}
                  
                  openModel={() =>
                    openInforDetail(item.name, item.address, item.phone)
                  }
                  id={item.debtNo}
                  lend={lendLoanAct}
                />
                </div>
              ))}
        </div>
        {/* {loading && <Loading />} */}
        {pageNum.length !== 0 && (
          <div className="pagination">
            <span>&laquo;</span>
            {pageNum.map((number) => (
              <span
                key={number}
                className={currentPage === number ? "active" : ""}
                onClick={() => changePage(number)}
              >
                {number + 1}
              </span>
            ))}
            <span>&raquo;</span>
          </div>
        )}
        <Popup
          name={inforDetail.name}
          address={inforDetail.address}
          phone={inforDetail.phone}
          show={openPopup}
          closed={closeInforDetail}
        />
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    address: state.address,
    usdRate: state.usdRate,
  };
};
export default connect(mapStateToProps)(FundPage);
