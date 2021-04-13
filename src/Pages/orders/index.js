import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
import "./index.scss";
import ViewModal from "./ViewModal";

import fire from "../../firebase";

import OrderSkeleton from "./order_skeleton";

import Pagination from "./pagination";

import { Redirect } from "react-router-dom";

const { parse, stringify } = require("flatted");
const db = fire.firestore();

const pageSize = 10;

export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      orders: [],
      filteredData: null,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.setOrders();
  }

  setOrders = () => {
    fire.auth().onAuthStateChanged((userAuth) => {
      console.log("logged in user: " + JSON.stringify(userAuth));
      if (userAuth != null) {
        this.setState({ user: userAuth, loggedIn: true });
        db.collection("orders")
          //.orderBy('createdAt', 'desc')
          .where("userId", "==", db.collection("users").doc(userAuth.uid))
          .get()
          .then((data) => {
            let orders = [];
            data.forEach((doc) => {
              orders.push({
                id: doc.id,
                address: doc.data().address,
                cart: doc.data().cart,
                date: doc.data().date,
                fullName: doc.data().fullname,
                mode: doc.data().mode,
                paid: doc.data().paid,
                phoneNumber: doc.data().phoneNumber,
                ref_no: doc.data().ref_no,
                status: doc.data().status,
                total: doc.data().total,
                userId: doc.data().userId,
              });
            });
            
            this.setState(() => {
              return {
                orders: [...orders],
                filteredData: [...orders],
              };
            });
          })
          .catch((err) => {
            return {
              orders: [],
              filteredData: [],
              redirectTo: '/'
            };
            console.error(err);
          });
      } else {
        this.setState({ user: null, loggedIn: false, redirectTo: '/' });
      }
    });
  };

  setCurrentPage = (page) => {
    // const {numberOfPages, filteredData} = this.state;
    // console.log("page clicked: " + page)
    // var startIndex = (page - 1) * pageSize;
    // var endIndex = Math.min(startIndex + pageSize - 1, numberOfPages - 1);
    // var tempArray = [filteredData.slice(startIndex, endIndex)]
    this.setState({
      currentPage: page,
      //filteredData: tempArray
    })

  }

  render() {
    const { filteredData, currentPage, redirectTo } = this.state;
    var numberOfPages = 0;
    if (filteredData !== null) {
      if (filteredData.length % 10 === 0)
        numberOfPages = Math.floor(filteredData.length / 10);
      else numberOfPages = Math.floor(filteredData.length / 10) + 1;
    }

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
      <div>
        <Navbar />
        <div id="orders">
          {filteredData != null &&
            filteredData.map((order) => (
              <ViewModal
                key={order.id}
                order={order}
                vendors={this.state.vendors}
                callback={this.handleRefresh}
              />
            ))}

          {filteredData === null && <OrderSkeleton />}

          {filteredData && filteredData.length === 0 && (
            <p className="empty-order">No order available yet.</p>
          )}
        </div>
        <Pagination  numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={this.setCurrentPage}/>
        <Footer />
      </div>
    );
  }
}
