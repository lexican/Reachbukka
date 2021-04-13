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

export default function CreateCategory() {

  const [redirectTo, setRedirectTo] = useState(null);

  const itemSchema = Yup.object().shape({
    category: Yup.string().required("Required"),
  });

  if(redirectTo){
    return <Redirect to={redirectTo}/>
  }

  return (
    <>
      <CCard>
        <CCardHeader>
{/*           <div className="d-flex justify-content-end">
            <Link>
              <CButton color="" className="m-2 btn-pri">
                New Location
              </CButton>
            </Link>
          </div> */}
        </CCardHeader>
        <CCardBody>
          <Formik
            initialValues={{
              category: "",
            }}
            validationSchema={itemSchema}
            onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
              const db = fire.firestore();
              db.collection("category").add({ name: values.category });
              console.log("Created");
              toast.success("Category created successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              resetForm();
              setRedirectTo("/admin/categories");
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
