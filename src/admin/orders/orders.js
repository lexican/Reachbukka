import React, { useState, useEffect } from "react";
import fire from "../../firebase";
import { Link } from "react-router-dom";
import { numberWithCommas } from "../../components/Utils/util";
import {
  CButton,
  CCardBody,
  CDataTable,
  CCard,
  CCardHeader,
  CCardFooter,
} from "@coreui/react";



const { parse } = require("flatted");

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    const db = fire.firestore();
    db.collection("orders")
      .get()
      .then((data) => {
        let orders = [];
        data.forEach((doc) => {
          orders.push({
            id: doc.id,
            ref_no: doc.data().ref_no,
            fullname: doc.data().fullname,
            total: doc.data().total,
            status: doc.data().status,
            mode: doc.data().mode,
            date: doc.data().date,
            //address: parse(doc.data().address),
            //cart: parse(doc.data().cart),
            address: doc.data().address.name,
            cart_length: doc.data().cart.length,
          });
        });
        setOrders(orders);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getOrders();
  }, []);

  const fields = [
    { key: "ref_no", _style: { width: "15%" } },
    { key: "fullname", _style: { width: "15%" } },
    { key: "cart_length", _style: { width: "10%" }, label: "Count" },
    { key: "total", _style: { width: "10%" } },
    { key: "mode", _style: { width: "20%" } },
    { key: "status", _style: { width: "10%" } },
    { key: "address", _style: { width: "20%" } },
    {
      key: "actions",
      label: "actions",
      _style: { width: "1%" },
      sorter: false,
    },
  ];

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between">
            <div className="heading-title">Orders</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={orders}
            fields={fields}
            tableFilter
            footer
            itemsPerPageSelect
            itemsPerPage={100}
            hover
            sorter
            pagination
            scopedSlots={{
              total: (item) => (
                <td>{"\u20A6" + numberWithCommas(item.total)}</td>
              ),
              actions: (item, index) => {
                return (
                  <td>
                    <Link to={"/admin/orders/" + item.id}>
                      <CButton color="" className="btn-pri">
                        Update
                      </CButton>
                    </Link>
                  </td>
                );
              },
            }}
          />
        </CCardBody>
        <CCardFooter>Footer.</CCardFooter>
      </CCard>
    </>
  );
}
