import React, { useEffect, useState } from "react";
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

import Select from "react-select";

import "firebase/storage";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for everything
import fire from "../../firebase";

import { Redirect, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateProduct() {
  const [categories, setCategories] = useState([]);
  const [redirectTo, setRedirectTo] = useState(null);
  const [image, setImage] = useState(null);

  const [product, setProduct] = useState({});
  const [category, setCategory] = useState({});

  const [mode, setMode] = useState("New");

  const { id } = useParams();

  const getCategories = () => {
    const db = fire.firestore();
    db.collection("category")
      .get()
      .then((data) => {
        let categories = [];
        data.forEach((doc) => {
          categories.push({
            id: doc.id,
            name: doc.data().name,
          });
        });
        setCategories(categories);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getProduct = () => {
    const db = fire.firestore();
    console.log(id);
    console.log("Called");
    if (id != null) {
      db.collection("products")
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log("No such document!");
            setRedirectTo("/admin/products");
          } else {
            console.log("Document data:", doc.data().title);
            setProduct({
              id: doc.id,
              title: doc.data().title,
              price: doc.data().price,
              available: doc.data().available,
              product_image: doc.data().product_image,
            });
            setMode("Edit");
            if(doc.data().categoryId){
              doc
              .data()
              .categoryId.get()
              .then((doc) => {
                if (!doc.exists) {
                  console.log("No such category!");
                  //setRedirectTo("/admin/locations");
                } else {
                  console.log("Category data:", doc.data().name);
                  setCategory({
                    id: doc.id,
                    name: doc.data().name,
                  });
                  setMode("Edit");
                }
              });
            }
          }
        });
    }
  };

  useEffect(() => {
    getCategories();
    getProduct();
  }, []);

  const itemSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    product_image: Yup.string().required("Required"),
    price: Yup.number("Invalid Price")
      .typeError("Enter a valid price.")
      .required("Required"),
    category: Yup.object().shape({
      name: Yup.string().required("Required"),
    }),
    // price: Yup.number().test("is-decimal", "invalid decimal", (value) =>
    //   (value + "").match(/^\d*\.{1}\d*$/)
    // ),
  });

  const onFileChange = (e) => {
    //setUploadedFile(e.target.files[0]);
    const file = e.target.files[0];
    console.log("file", file);
    const formData = new FormData();
    formData.append("image", file);
    setImage(file);
  };

  if (redirectTo != null) {
    return <Redirect to={redirectTo} />;
  }

  var initialValues = {
    title: "",
    price: "",
    category: {},
    product_image: "",
  };

  if (mode === "Edit") {
    initialValues = {
      title: product.title !== null ? product.title : "",
      price: product.price !== null ? product.price : "",
      category: {
        name: category.name ? category.name : "",
        id: category.id ? category.id : "",
      },
      product_image: product.product_image !== null ? product.product_image : "",
    };
  }

  var product_url = product.product_image !== "" ? product.product_image : "";
  //console.log("product_url: " + product_url);

  return (
    <>
      <CCard id="create-product">
        <CCardHeader>
          <div className="d-flex justify-content-start">
            <div>Create New Product</div>
          </div>
        </CCardHeader>
        <CCardBody>
          <Formik
            enableReinitialize={mode === "Edit" ? true : false}
            initialValues={initialValues}
            validationSchema={itemSchema}
            onSubmit={(values, { setSubmitting, setFieldError, resetForm }) => {
              setSubmitting(true);
              const db = fire.firestore();
              if (mode === "New") {
                console.log(JSON.stringify(values));
                console.log("category required" + values.category);
                var path = image.name;
                const uploadTask = fire
                  .storage()
                  .ref(`images/${image.name}`)
                  .put(image);
                uploadTask.on(
                  "state_changed",
                  (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    console.log(snapShot);
                  },
                  (err) => {
                    //catches the errors
                    console.log(err);
                    setSubmitting(false);
                  },
                  () => {
                    console.log("Done");
                    //gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    fire
                      .storage()
                      .ref("images")
                      .child(path)
                      .getDownloadURL()
                      .then((fireBaseUrl) => {
                        console.log("fireBaseUrl: " + fireBaseUrl);
                        db.collection("products").add({
                          title: values.title,
                          price: values.price,
                          categoryId: db
                            .collection("category")
                            .doc(values.category.id),
                          product_image: fireBaseUrl,
                          available: true,
                        });
                        console.log("Created");
                        toast.success("Product created successfully", {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
                      });
                    resetForm();
                    setRedirectTo("/admin/products");
                    setSubmitting(false);
                  }
                );
              } else {
                if (image) {
                  console.log("With image")
                  console.log(JSON.stringify(values));
                  console.log("category required" + values.category);
                  var path = image.name;
                  const uploadTask = fire
                    .storage()
                    .ref(`images/${image.name}`)
                    .put(image);
                  uploadTask.on(
                    "state_changed",
                    (snapShot) => {
                      //takes a snap shot of the process as it is happening
                      console.log(snapShot);
                    },
                    (err) => {
                      //catches the errors
                      console.log(err);
                      setSubmitting(false);
                    },
                    () => {
                      console.log("Done");
                      //gets the functions from storage refences the image storage in firebase by the children
                      // gets the download url then sets the image from firebase as the value for the imgUrl key:
                      fire
                        .storage()
                        .ref("images")
                        .child(path)
                        .getDownloadURL()
                        .then((fireBaseUrl) => {
                          console.log("fireBaseUrl: " + fireBaseUrl);
                          db.collection("products")
                            .doc(id)
                            .set({
                              title: values.title,
                              price: values.price,
                              categoryId: db
                                .collection("category")
                                .doc(values.category.id),
                              product_image: fireBaseUrl,
                              available: true,
                            });
                          console.log("Updated");
                          toast.success("Product updated successfully", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                          });
                        });
                      resetForm();
                      setRedirectTo("/admin/products");
                      setSubmitting(false);
                    }
                  );
                } else {
                  console.log("Without image")
                  db.collection("products").doc(id).update({
                    title: values.title,
                    price: values.price,
                    categoryId: db
                      .collection("category")
                      .doc(values.category.id),
                    available: true,
                  });
                  console.log("Updated");
                  toast.success("Product updated successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  resetForm();
                  setRedirectTo("/admin/products");
                  setSubmitting(false);
                }
              }
            }}
          >
            {({
              isSubmitting,
              errors,
              values,
              setFieldValue,
              handleBlur,
              touched,
            }) => (
              <Form>
                {errors.error && <p className="form-error">{errors.error}</p>}
                <CRow>
                  <CCol lg="12" md="12" sm="12" className="mb-3">
                    <CLabel>Title</CLabel>
                    <CInputGroup className="">
                      <Field
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Title"
                      />
                    </CInputGroup>
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="form-error"
                    />
                  </CCol>
                </CRow>

                <CRow>
                  <CCol sm="12" className="mb-3">
                    <CLabel>Product Picture</CLabel>
                    <CInputGroup className="">
                      <input
                        type="file"
                        id="product_image"
                        name="product_image"
                        accept="image/png, image/jpeg"
                        className="fileUpload"
                        onChange={(e) => {
                          setFieldValue("product_image", "value");
                          onFileChange(e);
                        }}
                      />
                    </CInputGroup>
                    <ErrorMessage
                      name="product_image"
                      component="div"
                      className="form-error"
                    />
                  </CCol>
                </CRow>

                {(product_url != "" && !image) && (
                  <CRow>
                    <CCol sm="12" className="mb-3">
                      <img src={product_url}></img>
                    </CCol>
                  </CRow>
                )}

                <CRow>
                  <CCol lg="12" md="12" sm="12" className="mb-3">
                    <CLabel>Price</CLabel>
                    <CInputGroup className="">
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
                  <CCol className="mb-3">
                    <CLabel>Category</CLabel>
                    <Select
                      className=""
                      id={"category"}
                      type={"text"}
                      value={values.category}
                      onChange={(option) => setFieldValue("category", option)}
                      options={categories}
                      onBlur={handleBlur}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      placeholder="Choose Category"
                    />
                    {/*                     <ErrorMessage
                      name="category"
                      component="div"
                      className="form-error"
                    /> */}
                    {!!errors.category && touched && (
                      <div className="form-error">{errors.category.name}</div>
                    )}
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
