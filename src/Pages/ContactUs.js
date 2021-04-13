import React, { Component } from "react";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar";
import "./contactus.scss";
import fire from "../firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for everything

const itemSchema = Yup.object().shape({
  fullname: Yup.string().required("Required"),
  subject: Yup.string().required("Required"),
  email: Yup.string().email("Enter a valid email").required("Required"),
  message: Yup.string().required("Required"),
});

export default class ContactUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messageError: "",
      statusMessage: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    const {
      statusMessage,
    } = this.state;
    return (
      <>
        <Navbar/>
        <section className="contact-us">
          <div className="contact-us-banner">
            <div className="contact-us-wrapper">
              <h1 className="text-center">Contact Us</h1>
              <h6 className=" text-center">We love to here your feedback</h6>
            </div>
          </div>
          <div className="top-wrapper container">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-6 col-md-12 col-sm-12 mx-0 py-0">
                <div className="inner-wrapper"></div>
              </div>
              <div className="col-xl-6 col-md-8 col-sm-12 inner-form">
                {statusMessage && (
                  <div className="col-12 px-0">
                    <div className="alert alert-success">{statusMessage}</div>
                  </div>
                )}
                <div className="text-center col-12 h3 font-family-roboto my-3">
                  Contact Us
                </div>
                <Formik
                  initialValues={{
                    fullname: "",
                    email: "",
                    subject: "",
                    message: "",
                  }}
                  validationSchema={itemSchema}
                  onSubmit={(
                    values,
                    { setSubmitting, setFieldError, resetForm }
                  ) => {
                    setSubmitting(true);
                    const db = fire.firestore();

                    db.collection("feedbacks").add({
                      fullname: values.fullname,
                      email: values.email,
                      subject: values.subject,
                      message: values.message
                    });

                    this.setState({statusMessage: "Feedback submitted successfully."});
                    setSubmitting(false)
                    resetForm()
                  }}
                >
                  {({
                    isSubmitting,
                    errors,
                  }) => (
                    <Form>
                      {errors.error && (
                        <p className="form-error">{errors.error}</p>
                      )}
                      <div class="form-group">
                        <label>Full Name</label>
                        <Field
                          type="text"
                          class="form-control"
                          placeholder="Ben Hunter"
                          name="fullname"
                        />
                        <ErrorMessage
                          name="fullname"
                          component="div"
                          className="form-error"
                        />
                      </div>
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
                      <div class="form-group">
                        <label>Subject</label>
                        <Field
                          type="text"
                          class="form-control"
                          placeholder="Subject"
                          name="subject"
                        />
                        <ErrorMessage
                          name="subject"
                          component="div"
                          className="form-error"
                        />
                      </div>
                      <div class="form-group">
                        <label>Message</label>
                        <Field
                          class="form-control"
                          rows="3"
                          name="message"
                          component="textarea"
                        ></Field>
                        <ErrorMessage
                          name="message"
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
          </div>
        </section>
        <Footer />
      </>
    );
  }
}
