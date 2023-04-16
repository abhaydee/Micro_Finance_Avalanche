import React, { useState, useEffect } from "react";
import "./CouponPage.scss";
import CouponBackground from "../../assets/image/coupon_cover.jpg";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CouponItem from "../../component/CouponItem/CouponItem";
import RedeemedItem from "../../component/RedeemedItem/RedeemedItem";
import CouponList from "../../scripts/couponList.json";
import { getTokenBalance, burnToken } from "../../blockchain/contractInteract";
import Loading from "../../component/Loading/Loading";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { generateString } from "../../scripts/utility";
import { database } from "../../firebase/FireBaseRef";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`
  };
}

function CouponPage(props) {
  const { userAddr } = props;
  const [value, setValue] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [redeemedCoupons, setRedeemedCoupon] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    getTokenBalance(userAddr).then(result => setTokenBalance(result));
    let getCouponData = database.ref("coupon");
    getCouponData
      .orderByChild("userAddr")
      .equalTo(userAddr)
      .on("child_added", async function(snapshot) {
        let productInfo = CouponList.filter(coupon => {
          return coupon.id === snapshot.val().product;
        });
        let item = {
          product: snapshot.val().product,
          productCode: snapshot.val().productCode,
          image: productInfo[0].image
        };
        setRedeemedCoupon(previousState => [...previousState, item]);
      });
  }, [userAddr]);
  const getCouponCode = async (product, amount) => {
    setLoading(true);
    try {
      const receipt = await burnToken(amount);
      console.log(receipt);
      const productCode = product + generateString(5);
      let couponData = { product, productCode, userAddr };
      await database.ref("coupon").push(couponData);
      Swal.fire({
        icon: "success",
        title: "Redeemed successfully",
        text: `Your coupon code : ${couponData.productCode}`
      });
      getTokenBalance(userAddr).then(result => setTokenBalance(result));
      setLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message
      });
      setLoading(false);
    }
  };
  return (
    <div className="coupon">
      {loading && <Loading />}
      <img
        src={CouponBackground}
        alt="coupon-background"
        className="coupon__banner"
      />
      <div className="coupon__balance">
        <p>
          Balance: <span>{tokenBalance}</span> Heart Token
        </p>
      </div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          className="coupon__tab"
        >
          <Tab label="Coupon" {...a11yProps(0)} />
          <Tab label="Redeemed" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className="coupon__items">
          {CouponList.map(item => (
            <CouponItem
              image={item.image}
              id={item.id}
              amount={item.amount}
              title={item.title}
              enddate={item.enddate}
              canBeRedeemed={parseInt(item.amount) <= parseInt(tokenBalance)}
              getCode={getCouponCode}
              key={item.id}
            />
          ))}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="coupon__items">
          {redeemedCoupons.length === 0 ? (
            <span>No Redeemed Coupon</span>
          ) : (
            <React.Fragment>
              {redeemedCoupons.map(coupon => (
                <RedeemedItem
                  image={coupon.image}
                  id={coupon.product}
                  key={coupon.productCode}
                  title={coupon.product}
                  code={coupon.productCode}
                  enddate={coupon.enddate}
                />
              ))}
            </React.Fragment>
          )}
        </div>
      </TabPanel>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    userAddr: state.address
  };
};
export default connect(mapStateToProps)(CouponPage);
