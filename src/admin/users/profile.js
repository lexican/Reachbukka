import React, { useEffect, useState } from "react";
import "./profile.scss";
import { Link, Redirect, useParams } from "react-router-dom";
import fire from "../../firebase";
import {
  CButton,
  CCardBody,
  CCard,
  CCol,
  CInputGroup,
  CRow,
  CForm,
  CCardHeader,
  CCardFooter,
  CLabel,
} from "@coreui/react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; 
import { toast } from "react-toastify";
import Image from "../../assets/images/user.jpg"
// const handleDate = (date) => {
//   //new Date(user.createdAt.seconds * 1000).toLocaleDateString("en-US")
//   //var time = moment(date).format("DD-MM-YYYY h:mm:ss");
//   return new Date(date.seconds * 1000).toLocaleDateString("en-US");
// };

export default function Profile() {
  const [user, setUser] = useState({});
  const [redirectTo, setRedirectTo] = useState(null);
  const { id } = useParams();

  const getUser = () => {
    const db = fire.firestore();
    if (id != null) {
      db.collection("users")
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("No such document!");
            setRedirectTo("/admin/users");
          } else {
            console.log("Document data:", doc.data().title);
            setUser({
              id: doc.id,
              bio: doc.data().bio,
              displayName: doc.data().displayName,
              email: doc.data().email,
              photoUrl: doc.data().photoUrl,
              timestamp: doc.data().timestamp,
              username: doc.data().username,
              role: doc.data().role,
            });
          }
        });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const SignupSchema = Yup.object().shape({
    role: Yup.string().required("Required"),
  });

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <>
      <CCard id="profile-admin">
        <CCardHeader>
        <div className="d-flex justify-content-start">
            <div cl="heading-title">Profile</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              {(user && user.photoUrl) && <img src={user.photoUrl} alt=""></img>}
              {(user && !user.photoUrl) && <img src={Image} alt=""></img>}
            </CCol>

            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              {(user && user.displayName) && (
                <div className="displayname">{user.displayName}</div>
              )}
            </CCol>
            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              {(user && user.username) && (
                <div className="username">{user.username}</div>
              )}
            </CCol>
            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              {user && user.email && <div className="email">{user.email}</div>}
            </CCol>
            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              {(user && user.bio) && (
                <div className="bio">
                  <div>
                    <span>Bio</span>
                  </div>
                  <div className="bio">{user.bio}</div>
                </div>
              )}
            </CCol>
            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              {(user && user.role) && (
                <>
                  <div className={user.role == "Admin" ? "admin" : "user"}>
                    {user.role}
                  </div>
                </>
              )}
            </CCol>
          </CRow>
          <CRow>
            <CCol
              lg="12"
              md="12"
              sm="12"
              className="mb-2 d-flex justify-content-center"
            >
              <Formik
                enableReinitialize={true}
                initialValues={{
                  role: user.role ? user.role : "",
                }}
                validationSchema={SignupSchema}
                onSubmit={(
                  values,
                  { setSubmitting, setFieldError, resetForm }
                ) => {
                    setSubmitting(true)
                    const db = fire.firestore();
                    db.collection("users")
                    .doc(id)
                    .update({role: values.role});
                    console.log("Updated");
                    toast.success("User updated successfully", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setSubmitting(false)
                    getUser()
                }}
              >
                {({ isSubmitting, errors }) => (
                  <Form>
                    {errors.error && (
                      <p className="form-error">{errors.error}</p>
                    )}

                    <CRow className="">
                      <CCol lg="12" md="12" sm="12">
                        <CInputGroup className="mb-3">
                          <Field
                            name="role"
                            component="select"
                            placeholder="Designation"
                            className="form-control form-select form-select-lg d-block"
                          >
                            <option value="">Select Designation</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                          </Field>
                          <ErrorMessage
                            name="role"
                            component="div"
                            className="form-error"
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs="12" className="d-flex justify-content-center btn-block">
                        <CButton
                          color="d-block"
                          className="px-4 btn-pri"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Update
                        </CButton>
                      </CCol>
                    </CRow>
                  </Form>
                )}
              </Formik>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>Footer.</CCardFooter>
      </CCard>
    </>
  );
}
