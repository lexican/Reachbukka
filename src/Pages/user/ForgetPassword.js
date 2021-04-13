import React, { Component } from "react";
import Navbar from "../../components/Navbar";
import fire from "../../firebase";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for

import './forgetpassword.scss'

const itemSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email").required("Required"),
});

export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      statusMessage: "",
      error: ""
    };
  }
  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    // this.setState(() => {
    //   return {
    //     isLoading: true,
    //   };
    // });
    fire.auth().onAuthStateChanged((userAuth) => {
      if (userAuth != null) {
        this.setState({
        //   user: userAuth,
        //   loggedIn: true,
          redirectTo: "/",
         // isLoading: false,
        });
      }
    });
  };
  render() {
    const { redirectTo, statusMessage, error } = this.state;
    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }
    return (
      <div>
        <Navbar />
        <div id="forget-password"  className="container">
        {error && <p className="error">{error}</p>}
          {statusMessage && (
            <div className="col-12 px-0">
              <div className="alert alert-success">{statusMessage}</div>
            </div>
          )}
          <Formik
            initialValues={{
              fullname: "",
              email: "",
              subject: "",
              message: "",
            }}
            validationSchema={itemSchema}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              setSubmitting(true);
              fire.auth()
              .sendPasswordResetEmail(values.email)
              .then(() => {
                this.setState({
                  statusMessage: "Reset password has been sent to your mail"
                });
                //setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
              })
              .catch(() => {
                this.setState({error: "Error resetting password"})
              });

              setSubmitting(false);
              resetForm();
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                {errors.error && <p className="form-error">{errors.error}</p>}

                <div class="form-group">
                  <label>Email</label>
                  <Field
                    type="text"
                    class="form-control"
                    placeholder="Email"
                    name="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="form-error"
                  />
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }
}
