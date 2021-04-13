import React, { Component } from "react";
import fire from "../../firebase";
import ViewModal from "./ViewModal";

import { Redirect } from "react-router-dom";



import "./index.scss";

const { parse } = require("flatted");



export default class update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {},
      redirectTo: null,
      loading: false,
    };
  }
  componentDidMount() {
    this.setProduct();
  }

  setProduct = () => {
    if (this.props.match.params.id) {
      this.setState({ loading: true });
      const db = fire.firestore();
      db.collection("orders")
        .doc(this.props.match.params.id)
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            this.setState({
              order: {
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
              },
            });
            this.setState({ loading: false });
          } else {
            console.log("No such document!");
            this.setState({ redirectTo: "/admin/dashboard", loading: false });
          }
        })
        .catch((err) => {
          console.error(err);
          this.setState({ redirectTo: "/admin/dashboard", loading: false });
        });
    } else {
      this.setState({ redirectTo: "/admin/dashboard", loading: false });
    }
  }

  setRedirect = () => {
    this.setState({redirectTo: "/admin/orders"});
  }

  render() {
    const { redirectTo, loading } = this.state;
     if (redirectTo) {
      return <Redirect to={redirectTo} />;
    } 
    if (!loading) {
      //return <div>koooo{stringify(this.state.order)}</div>
      return (
        <div id="orders-admin">
          <ViewModal order={this.state.order} setRedirect={this.setRedirect}/>
        </div>
      );
    }
    return null;
  }
}
