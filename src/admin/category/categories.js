import React, { useState, useEffect } from "react";
import fire from "../../firebase";
import { Link, Redirect } from "react-router-dom";
import { numberWithCommas } from "../../components/Utils/util";
import {
  CButton,
  CCardBody,
  CDataTable,
  CModal,
  CModalHeader,
  CModalBody,
  CContainer,
  CCard,
  CCol,
  CInputGroup,
  CRow,
  CForm,
  CCardHeader,
  CCardFooter,
  CLabel,
} from "@coreui/react";

import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const handleDate = (date) => {
  //new Date(user.createdAt.seconds * 1000).toLocaleDateString("en-US")
  //var time = moment(date).format("DD-MM-YYYY h:mm:ss");
  return new Date(date.seconds * 1000).toLocaleDateString("en-US");
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [redirectTo, setRedirectTo] = useState(null);

  const getCategories = () => {
    const db = fire.firestore();
    db.collection("category")
      //.orderBy("name", "desc")
      .get()
      .then((data) => {
        let categories = [];
        data.forEach((doc) => {
          categories.push({
            id: doc.id,
            amount: doc.data().amount,
            name: doc.data().name,
          });
        });
        setCategories(categories);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteItemDialogBox = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const db = fire.firestore();
            db.collection("locations").doc(id).delete();
            toast.success("Record deleted successfully", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            getCategories();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const setEditItem = (id) => {
    setRedirectTo("/admin/categories/edit/" + id)
  }

  useEffect(() => {
    getCategories();
  }, []);

  const fields = [
    { key: "name", _style: { width: "40%" } },
    //{ key: "price", _style: { width: "20%" } },
    {
      key: "actions",
      label: "actions",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  if(redirectTo){
    return <Redirect to={redirectTo}/>
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
          <div className="heading-title">Category</div>
            <Link to="/admin/categories/new">
              <CButton color="" className="m-2 btn-pri">
                New Location
              </CButton>
            </Link>
          </div>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={categories}
            fields={fields}
            tableFilter
            footer
            itemsPerPageSelect
            itemsPerPage={100}
            hover
            sorter
            pagination
            scopedSlots={
              {
                actions: (item, index) => {
                  return (
                    <td className="py-2" id="actions">
                      <div className="">
                        <span className="mr-2" onClick={() => setEditItem(item.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="1em"
                            height="1em"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </span>
                        <span onClick={() => deleteItemDialogBox(item.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width="1em"
                            height="1em"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </span>
                      </div>
                    </td>
                  );
                },
              }
            }
          />
        </CCardBody>
        <CCardFooter>Footer.</CCardFooter>
      </CCard>
    </>
  );
}
