import React, { useState, useEffect } from "react";
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

import { Redirect, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditLocation() {
  const [redirectTo, setRedirectTo] = useState(null);
  const [location, setLOcation] = useState("");
  const [price, setPrice] = useState("");

  const params = useParams();

  const itemSchema = Yup.object().shape({
    location: Yup.string().required("Required"),
    price: Yup.number("Invalid Price")
      .typeError("Enter a valid price.")
      .required("Required"),
  });

  const getLocation = () => {
    const db = fire.firestore();
    console.log(params)
    console.log("Called")
    db.collection("locations")
      .doc(params.id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such document!");
          //setRedirectTo("/admin/locations");
        } else {
          console.log("Document data:", doc.data().name);
          setLOcation(doc.data().name);
          setPrice(doc.data().amount)
        }
      });
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-start">
            <div>Edit Location</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <Formik
           enableReinitialize
            initialValues={{
              location: location,
              price: price,
            }}
            validationSchema={itemSchema}
            onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
              const db = fire.firestore();
              setSubmitting(true);




              db.collection("locations")
                .where("name", "==", values.location)
                .get()
                .then((snapshot) => {
                  if (snapshot.empty) {
                    db.collection("locations").doc(params.id).update({
                      name: values.location,
                      amount: values.price,
                    });
                    console.log("Created");
                    toast.success("Location updated successfully", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    resetForm();
                    setSubmitting(false);
                    setRedirectTo("/admin/locations");
                  } else {
                    toast.warning("Location already exist", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setSubmitting(false);
                  }
                });

             
             

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
