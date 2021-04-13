import React, { useState, useEffect } from "react";
import fire from "../../firebase";
import { Link, Redirect } from "react-router-dom";
import {
  CCardBody,
  CDataTable,
  CCard,
  CCardHeader,
  CCardFooter,
} from "@coreui/react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

const handleDate = (date) => {
  return new Date(date.seconds * 1000).toLocaleDateString("en-US");
}


export default function Users() {
  const [users, setUsers] = useState([]);
  const [redirectTo, setRedirectTo] = useState(null);
  const getUsers = () => {
    const db = fire.firestore();
    db.collection("users")
      //.orderBy("name", "desc")
      .get()
      .then((data) => {
        let users = [];
        data.forEach((doc) => {
          users.push({
            id: doc.id,
            bio: doc.data().bio,
            displayName: doc.data().displayName,
            email: doc.data().email,
            photoUrl: doc.data().photoUrl,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
            role: doc.data().role,
          });
        });
        setUsers(users);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const fields = [
    { key: "email", _style: { width: "40%" } },
    { key: "displayName", _style: { width: "20%" } },
    { key: "username", _style: { width: "20%" } },
    { key: "timestamp", _style: { width: "20%" }, label: "Registered" },
    { key: "role", _style: { width: "20%" }, label: "Designation" },
    {
      key: "actions",
      label: "actions",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  const deleteItemDialogBox = (id) => {
    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure you want to delete this record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const db = fire.firestore();
            db.collection("users").doc(id).delete();
            toast.success("Record deleted successfully", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            getUsers();
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
    setRedirectTo("/admin/users/profile/" + id);
  };

  
  if(redirectTo){
    return <Redirect to={redirectTo}/>
  }


  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-start">
            <div cl="heading-title">Users</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CDataTable
            items={users}
            fields={fields}
            tableFilter
            footer
            itemsPerPageSelect
            itemsPerPage={100}
            hover
            sorter
            pagination
            scopedSlots={{
              email: (item) => (
                <td>
                  <Link to={"/admin/users/profile/" + item.id}>{item.email}</Link>
                </td>
              ),
              timestamp: (item) => <td>{handleDate(item.timestamp)}</td>,
              // createdAt: (item) => <td>{dateParser(item.createdAt)}</td>,
              actions: (item, index) => {
                return (
                  <td className="py-2" id="actions">
                    <div className="">
                      <span
                        className="mr-2"
                        onClick={() => setEditItem(item.id)}
                      >
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
            }}
          />
        </CCardBody>
        <CCardFooter>Footer.</CCardFooter>
      </CCard>
    </>
  );
}
