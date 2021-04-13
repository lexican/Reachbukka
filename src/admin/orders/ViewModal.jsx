import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { numberWithCommas } from "../../components/Utils/util";

import fire from "../../firebase"

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
  CRow,
  CCol,
} from "@coreui/react";
import { toast } from "react-toastify";

const Order = (props) => (
  <tr>
    <td>{props.order.title}</td>
    <td>{props.order.count}</td>
    <td>{"\u20A6" + numberWithCommas(props.order.price)}</td>
  </tr>
);

export default class ViewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }

  setAccordion = () => {
    this.setState({
      show: !this.state.show,
    });
  };
  handleDate(date) {
    return new Date(date.seconds * 1000).toLocaleDateString("en-US");
  }

  handleStatusUpdate(status){
    const db = fire.firestore();
    db.collection('orders').doc(this.props.order.id).update({status: status});
    toast.success("Order updated successfully", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    this.props.setRedirect();
  }

  render() {
    const {
      //id,
      address,
      cart,
      date,
      fullName,
      mode,
      //paid,
      phoneNumber,
      ref_no,
      status,
      total,
      //userId,
    } = this.props.order;
    const { show } = this.state;
    return (<>
    <CCard>
      <CCardHeader className="d-flex justify-content-end">
        {status == "Pending" && <button className="btn btn-confirm" onClick={() => {this.handleStatusUpdate("Delivered")}}>Confirm</button>}
        {status == "Delivered" && <button className="btn btn-danger" onClick={() => {this.handleStatusUpdate("Cancelled")}}>Revoke</button>}
        {status == "Cancelled" && <button className="btn btn-danger" onClick={() => {this.handleStatusUpdate("Pending")}}>Revoke</button>}
      </CCardHeader>
    </CCard>
      <CCard className="" id="card-item">
        <CCardHeader id="headingOne">
          <div
            block
            color="link"
            className="text-left m-0 p-0"
            onClick={() => this.setAccordion()}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              id="lg"
            >
              <div className="sm-inline">
                <div className="light_bg_grey">ORDER ID</div>
                <div>{ref_no}</div>
              </div>

              <div className="sm-inline">
                <div className="light_bg_grey">ORDER DATE</div>
                {date != null && <div>{this.handleDate(date)}</div>}
              </div>

              <div className="sm-inline">
                <div className="light_bg_grey">FULLNAME</div>
                <div>{fullName}</div>
              </div>

              <div className="sm-inline">
                <div className="light_bg_grey">PAMENT MODE</div>
                <div>
                  <span>{mode}</span>
                </div>
              </div>

              <div className="sm-inline">
                <div className="light_bg_grey">STATUS</div>
                <div>
                  {status === "Pending" && (
                    <span>
                      <FontAwesomeIcon
                        icon="check-circle"
                        className="warn_bg"
                      />
                      Pending
                    </span>
                  )}
                  {status === "Delivered" && (
                    <span>
                      <FontAwesomeIcon
                        icon="check-circle"
                        className="green_bg"
                      />
                      Delivered
                    </span>
                  )}
                  {status === "Cancelled" && (
                    <span>
                      <FontAwesomeIcon icon="check-circle" className="red_bg" />
                      Cancelled
                    </span>
                  )}
                </div>
              </div>

              <div className="sm-inline">
                <div className="light_bg_grey text-right">TOTAL</div>
                {total != null ? (
                  <div className="text-right">
                    {"\u20A6" + numberWithCommas(total)}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <div className="sm-inline">
                <div>
                  {show ? (
                    <span>
                      <FontAwesomeIcon icon="angle-up" />
                    </span>
                  ) : (
                    <span>
                      <FontAwesomeIcon icon="angle-down" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CCardHeader>
        <CCollapse show={show}>
          <CCardBody>
            <div className="">
              <div>
                <table className="table">
                  <thead className="">
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  {cart != null && (
                    <tbody>
                      {cart.map(function (order, i) {
                        return <Order key={i} order={order} options={order} />;
                      })}
                    </tbody>
                  )}
                </table>
                <div>
                  <CRow className="mb-2">
                    <CCol md sm="6" md="2" className="mb-sm-2 mb-0">
                      <span className="light_bg_grey mr-4">Delivery Address: </span>
                    </CCol>
                    <CCol md sm="6" md="10" className="mb-sm-2 mb-0">
                      {address != null && (
                        <span className="mr-4">{address.name}</span>
                      )}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md sm="6" md="2" className="mb-sm-2 mb-0">
                      <span className="light_bg_grey mr-4">Phone Number:</span>
                    </CCol>
                    <CCol md sm="6" md="10" className="mb-sm-2 mb-0">
                      <span>{phoneNumber}</span>
                    </CCol>
                  </CRow>
                </div>
              </div>
            </div>
          </CCardBody>
        </CCollapse>
      </CCard>
      </>
    );
  }
}
