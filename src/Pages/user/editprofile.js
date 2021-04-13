import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for everything
import fire from "../../firebase";
import Show404 from "../Page404/index";
import {
  CButton,
  CContainer,
  CCol,
  CInputGroup,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CForm,
} from "@coreui/react";

import "./editprofile.scss";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  role: Yup.string().required("Required"),
});

const PasswordResetSchema = Yup.object().shape({
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

export default class editprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidUser: true,
      isLoading: false,
      loggedIn: false,
      displayName: "",
      username: "",
      img: "",
      email: "",
      role: ""
    };
  }
  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    this.setState(() => {
      return {
        isLoading: true,
      };
    });
    fire.auth().onAuthStateChanged((userAuth) => {
      if (userAuth != null) {
        this.setState({
          loggedIn: false,
        });
        this.getProfile(userAuth.uid);
      } else {
        this.getProfile();
      }
    });
  };

  getProfile = (id) => {
    if (this.props.match.params.user !== "") {
      const db = fire.firestore();
      var usersRef = db.collection("users");
      usersRef
        .where("username", "==", this.props.match.params.user)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            this.setState(() => {
              return {
                isLoading: false,
                isValidUser: false,
              };
            });
          } else {
            snapshot.forEach((doc) => {
              //   console.log(doc.id, "=>", doc.data());
              //   console.log("this.state.userId", "=>", id);
              if (id === doc.id) {
                this.setState(() => {
                  return {
                    loggedIn: true,
                  };
                });
              }
              // var displayName = "";
              // var username = "";
              // var img = "";
              // var email = "";
              // if (auth != null) {
              //   displayName = auth.displayName;
              //   username = auth.username;
              //   const words = displayName.split(" ");
              //   displayName =
              //     words[0].substring(0, 1).toUpperCase() +
              //     words[0].substring(1) +
              //     " " +
              //     words[1].substring(0, 1).toUpperCase() +
              //     words[1].substring(1);
              //   img = auth.photoUrl;
              //   email = auth.email;
              // } else {
              //   displayName = "";
              //   username = "";
              //   img = "";
              //   email = "";
              // }
              this.setState(() => {
                return {
                  displayName: doc.data().displayName,
                  username: doc.data().username,
                  img: doc.data().img ? doc.data().img : -1,
                  email: doc.data().email,
                  role: doc.data().role,
                  isLoading: false,
                };
              });
            });
          }
        });
    }
  };

  onFileChange = (e) => {
    //setUploadedFile(e.target.files[0]);
    const file = e.target.files[0];
    console.log("file", file);
    const formData = new FormData();
    formData.append("image", file);
    let token = localStorage.getItem("token");
    if (file) {

    } else {
      console.log("No file!");
    }
  };



  render() {
    const {
      loggedIn,
      isLoading,
      img,
      isValidUser,
      username,
      email,
      displayName,
      show404,
      role
    } = this.state;

    var res = displayName.split(" ");

    var firstName = res[0];
    var lastName =  res[1];
                 
    
    if (!isLoading && show404) {
      return <Show404 />;
    }
    return (
      <div id="edit-profile">
        <Navbar/>
        <div className="row" id="main-container">
          <div className="col-md-4">
            <CContainer id="sec-1">
              <div>
              {img === -1 && <div className="profile-pic_2"></div>}
                {img !== -1 && (
                  <img src={img} img-avatar alt="..." />
                )}
              </div>
              <div>
                <p>{`${username}`}</p>
                <p>{`${displayName}`}</p>
              </div>
            </CContainer>
          </div>
          <div className="col-md-8">
            <CContainer id="sec-2">
              <CTabs activeTab="profile_information">
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink data-tab="profile_information">
                      Profile Information
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink data-tab="reset_password">
                      Reset Paasowrd
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane data-tab="profile_information">
                    <CContainer className="mt-3">
                      <CRow>
                        <CCol sm="12">
                          <CForm action="" method="post">
                            <CInputGroup className="mb-3">
                              <input
                                type="file"
                                id="profile_pic"
                                name="profile_pic"
                                accept="image/png, image/jpeg"
                                className="fileUpload"
                                onChange={(e) => {
                                  this.onFileChange(e);
                                }}
                              />
                            </CInputGroup>
                          </CForm>
                        </CCol>
                      </CRow>
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          email: email ? email : "",
                          username: username ? username : "",
                          firstName: firstName ? firstName : "",
                          lastName: lastName ? lastName : "",
                          role: role ? role: ""
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(
                          values,
                          { setSubmitting, setFieldError, resetForm }
                        ) => {

                          var user = {
                            firstName: values.firstName,
                            lastName: values.lastName,
                            middleName: values.middleName,
                            //profileImage: profile_pic,
                            role: values.role,
                          };

                          // if (token) {
                          //   axios
                          //     .put(
                          //       "http://localhost:4000/api/user/" + id,
                          //       user,
                          //       {
                          //         headers: { Authorization: `Bearer ${token}` },
                          //       }
                          //     )
                          //     .then((response) => {
                          //       // Success 🎉
                          //       console.log(
                          //         "Profile Details Updated successfully"
                          //       );
                          //       toast.success(
                          //         "Profile Details Updated successfully",
                          //         {
                          //           position: "top-right",
                          //           autoClose: 5000,
                          //           hideProgressBar: false,
                          //           closeOnClick: true,
                          //           pauseOnHover: true,
                          //           draggable: true,
                          //           progress: undefined,
                          //         }
                          //       );
                          //       setSubmitting(false);
                          //       resetForm();
                          //       getUser();
                          //     })
                          //     .catch((error) => {
                          //       if (error.response) {
                          //         setSubmitting(false);
                          //         console.log(error.response);
                          //       }
                          //       console.log(error.config);
                          //     });
                          // }
                        }}
                      >
                        {({ isSubmitting, errors }) => (
                          <Form>
                            {errors.error && (
                              <p className="form-error">{errors.error}</p>
                            )}
                            <CRow>
                              <CCol lg="6" md="6" sm="12" className="">
                                <CInputGroup className="mb-3">
                                  <Field
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    disabled
                                  />
                                </CInputGroup>
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                              <CCol lg="6" md="6" sm="12" className="">
                                <CInputGroup className="mb-3">
                                  <Field
                                    name="username"
                                    className="form-control"
                                    placeholder="Username"
                                    disabled
                                  />
                                </CInputGroup>
                                <ErrorMessage
                                  name="username"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol lg="6" md="6" sm="!2" className="">
                                <CInputGroup className="mb-3">
                                  <Field
                                    name="lastName"
                                    className="form-control"
                                    placeholder="Surname"
                                  />
                                </CInputGroup>
                                <ErrorMessage
                                  name="lastName"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                              <CCol lg="6" md="6" sm="12" className="">
                                <CInputGroup className="mb-3">
                                  <Field
                                    name="firstName"
                                    className="form-control"
                                    placeholder="First Name"
                                  />
                                </CInputGroup>
                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                            </CRow>
                            <CRow className="">
                              <CCol lg="6" md="6" sm="12">
                                <CInputGroup className="mb-3">
                                  <Field
                                    name="role"
                                    component="select"
                                    placeholder="Designation"
                                    className="form-control form-select form-select-lg d-block"
                                    disabled
                                  >
                                    <option value="">Select Designation</option>
                                    <option value="Admin">Admin</option>
                                    <option value="User">User</option>
                                  </Field>
                                </CInputGroup>
                                <ErrorMessage
                                  name="role"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol xs="12">
                                <CButton
                                  color=""
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
                    </CContainer>
                  </CTabPane>
                  <CTabPane data-tab="reset_password">
                    <CContainer className="my-4">
                      <Formik
                        initialValues={{
                          password: "",
                          confirm_password: "",
                        }}
                        validationSchema={PasswordResetSchema}
                        onSubmit={(
                          values,
                          { setSubmitting, setFieldError, resetForm }
                        ) => {
                        

                          var user = {
                            password: values.password,
                          };

                          // //alert(JSON.stringify(user, null, 2));
                          // if (token) {
                          //   axios
                          //     .post(
                          //       "/api/user/" + id + "/reset_password",
                          //       user,
                          //       {
                          //         headers: { Authorization: `Bearer ${token}` },
                          //       }
                          //     )
                          //     .then((response) => {
                          //       toast.success(
                          //         "User password changed successfully",
                          //         {
                          //           position: "top-right",
                          //           autoClose: 5000,
                          //           hideProgressBar: false,
                          //           closeOnClick: true,
                          //           pauseOnHover: true,
                          //           draggable: true,
                          //           progress: undefined,
                          //         }
                          //       );
                          //       resetForm();
                          //       setSubmitting(false);
                          //     })
                          //     .catch((error) => {
                          //       if (error.response) {
                          //         setSubmitting(false);
                          //         console.log(error.response);
                          //       }
                          //       console.log(error.config);
                          //     });
                          // }
                        }}
                      >
                        {({ isSubmitting, errors }) => (
                          <Form>
                            {errors.error && (
                              <p className="form-error">{errors.error}</p>
                            )}
                            <CRow>
                              <CCol lg="6" md="6" sm="12" className="mb-3">
                                <CInputGroup className="mb-3">
                                  <Field
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                  />
                                </CInputGroup>
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                            </CRow>
                            <CRow>
                              <CCol lg="6" md="6" sm="12" className="mb-3">
                                <CInputGroup className="mb-3">
                                  <Field
                                    type="password"
                                    name="confirm_password"
                                    className="form-control"
                                    placeholder="Confirm Password"
                                  />
                                </CInputGroup>
                                <ErrorMessage
                                  name="confirm_password"
                                  component="div"
                                  className="form-error"
                                />
                              </CCol>
                            </CRow>
                            <CButton
                              color=""
                              className="px-4 btn-pri"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              Submit
                            </CButton>
                          </Form>
                        )}
                      </Formik>
                    </CContainer>
                  </CTabPane>
                </CTabContent>
              </CTabs>
            </CContainer>
          </div>
        </div>
      </div>
    );
  }
}
