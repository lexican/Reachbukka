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

import {  Redirect, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditCategory() {
  const [redirectTo, setRedirectTo] = useState(null);
  const [category, setCategory] = useState("");
  const db = fire.firestore();
  const params = useParams();

  const itemSchema = Yup.object().shape({
    category: Yup.string().required("Required"),
  });

  const getCategory = () => {
    const db = fire.firestore();
    console.log(params);
    console.log("Called");
    db.collection("category")
      .doc(params.id)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          console.log("No such document!");
          setRedirectTo("/admin/category");
        } else {
          console.log("Document data:", doc.data().name);
          setCategory(doc.data().name);
        }
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-start">
            <div>Edit Category</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <Formik
            enableReinitialize
            initialValues={{
              category: category,
            }}
            validationSchema={itemSchema}
            onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
              setSubmitting(true);
              db.collection("category")
                .where("name", "==", values.category)
                .get()
                .then((snapshot) => {
                  if (snapshot.empty) {
                    console.log("No matching documents.");
                    db.collection("category").doc(params.id).update({ name: values.category });
                    console.log("Updated");
                    toast.success("Category updated successfully", {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                   // resetForm();
                    setSubmitting(false);
                   // setRedirectTo("/admin/categories");
                  } else {
                    toast.warning("Category already exist", {
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
                    <CLabel>Category</CLabel>
                    <CInputGroup className="mb-3">
                      <Field
                        type="text"
                        name="category"
                        className="form-control"
                        placeholder="Category"
                      />
                    </CInputGroup>
                    <ErrorMessage
                      name="category"
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
