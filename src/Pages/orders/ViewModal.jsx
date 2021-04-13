import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { numberWithCommas } from "../../components/Utils/util";
import moment from "moment";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCollapse,
} from "@coreui/react";

import {
CRow, CCol
} from '@coreui/react'

const { parse, stringify } = require("flatted");

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
    //new Date(user.createdAt.seconds * 1000).toLocaleDateString("en-US")
    //var time = moment(date).format("DD-MM-YYYY h:mm:ss");
    return new Date(date.seconds * 1000).toLocaleDateString("en-US");
  }

  render() {
    const {
      id,
      address,
      cart,
      date,
      fullName,
      mode,
      paid,
      phoneNumber,
      ref_no,
      status,
      total,
      userId,
    } = this.props.order;
    const { show } = this.state;
    return (
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
                <div>{this.handleDate(date)}</div>
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
                      Placed
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
                <div className="text-right">
                  {"\u20A6" + numberWithCommas(total)}
                </div>
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
                  <tbody>
                    {cart.map(function (order, i) {
                      //console.log("order", order)
                      return <Order key={i} order={order} options={order} />;
                    })}
                  </tbody>
                </table>

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

{/*                 <div className="d-flex justify-content-between align-items-center mb-2 mr-4 ml-2 p-2">
                  <div>
                    <div>
                      <span className="mr-1">Delivery Address: </span>
                      <span className="mr-4">{address.name}</span>
                    </div>
                    <div>
                      <span className="mr-1">Phone Number:</span>
                      <span>{phoneNumber}</span>
                    </div>
                  </div>
                </div>
                 */}
              </div>
            </div>
          </CCardBody>
        </CCollapse>
      </CCard>
    );
  }
}
