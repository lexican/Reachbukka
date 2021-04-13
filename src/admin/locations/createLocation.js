import React, { useState } from "react";
import {
  CButton,
  CCardBody,
  CCard,
  CCol,
  CInputGroup,
  CRow,
  CCardHeader,
  CCardFooter,
  CLabel,
} from "@coreui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for everything
import fire from "../../firebase";

import {  Redirect } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateLocation() {
  const [redirectTo, setRedirectTo] = useState(null);

  const itemSchema = Yup.object().shape({
    location: Yup.string().required("Required"),
    //price: Yup.number().integer('invalid Price'),
    price: Yup.number("Invalid Price")
      .typeError("Enter a valid price.")
      .required("Required"),
    // price: Yup.number().test("is-decimal", "invalid decimal", (value) =>
    //   (value + "").match(/^\d*\.{1}\d*$/)
    // ),
  });

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-start">
            <div>Create New Location</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <Formik
            initialValues={{
              location: "",
              price: "",
              //school: ""
            }}
            validationSchema={itemSchema}
            onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
              const db = fire.firestore();
              db.collection("locations").add({
                name: values.location,
                amount: values.price,
              });
              console.log("Created");
              toast.success("Location created successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              resetForm();
              setRedirectTo("/admin/locations");
            }}
          >
            {({ isSubmitting, errors, values, setFieldValue }) => (
              <Form>
                {errors.error && <p className="form-error">{errors.error}</p>}
                <CRow>
                  <CCol lg="12" md="12" sm="12" className="">
                    <CLabel>Location</CLabel>
                    <CInputGroup className="mb-3">
                      <Field
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="Location"
                      />
                    </CInputGroup>
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="form-error"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol lg="12" md="12" sm="12" className="">
                    <CLabel>Price</CLabel>
                    <CInputGroup className="mb-3">
                      <Field
                        type="text"
                        name="price"
                        className="form-control"
                        placeholder="Price"
                      />
                    </CInputGroup>
                    <ErrorMessage
                      name="price"
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
                      block
                    >
                      Submit
                    </CButton>
                  </CCol>
                </CRow>
              </Form>
            )}
          </Formik>
        </CCardBody>
        <CCardFooter>Footer.</CCardFooter>
      </CCard>
    </>
  );
}
