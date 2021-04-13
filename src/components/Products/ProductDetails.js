import React, { Component } from "react";
import { ProductConsumer } from "../../context";
import Navbar from "../Navbar";
import Skeleton from "react-loading-skeleton";
import { numberWithCommas } from "../Utils/util";
import fire from '../../firebase'
import './product-details.scss'

export default class product_details_page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {},
      show404: false,
      error: "",
      subTotal: 0,
      options: [],
      selectedOption: [],
      total: 0,
    };
  }


  componentDidMount() {
    window.scrollTo(0, 0);
    const id = this.props.match.params.id;
    //console.log("process.env.REACT_APP_HOSTNAME", REACT_APP_HOSTNAME);
        const db = fire.firestore();
        db.collection("products").doc(id)
          .get()
          .then((doc) => {
            if(doc.exists){
                console.log("data: " + doc.data());
                this.setState({
                    product: {
                        id: doc.id,
                        available: doc.data().available,
                        categoryId: doc.data().categoryId,
                        price: parseInt(doc.data().price),
                        product_image: doc.data().product_image,
                        title: doc.data().title,
                      }
                })
            }else{
                console.log("Document not found");
            }
          })
          .catch((err) => {
            console.error(err);
          });
  }

  addToCart = (addToCart) => {
    const { product, total } = this.state;

    product.total = total;

    console.log("Total", total);

    console.log(product);

    addToCart(product);

    console.log("Item added");

    //this.props.history.push("/cart");
  };

  render() {
    const { show404 } = this.state;

    const { product_image, title, price } = this.state.product;

    return (
      <section>
        <Navbar history={this.props.history} />
        <div id="product-details" className="container-fluid">
          <div className="pkk">
            {!show404 ? (
              <>
                <div className="pdw">
                  <div className="d-inline-flex">
                    <div className="">
                      {product_image ? (
                        <img
                          src={product_image}
                          alt="product"
                          className="img-container"
                        ></img>
                      ) : (
                        <div className="img-container">
                          <Skeleton height={40} />
                        </div>
                      )}
                    </div>
                  </div>
                  {title ? (
                    <div class="d-inline-flex -title___Nx f-lg lh-title f-roboto p-2">
                      {title}
                    </div>
                  ) : (
                    <div class="d-inline-flex -title___Nx f-lg lh-title f-roboto p-2">
                      <Skeleton count={3} width={120}/>
                    </div>
                  )}
                </div>
                <div className="pd-o">
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                      {price ? (
                        <div className="font-family-roboto total">
                          {"\u20A6" + numberWithCommas(price)}
                        </div>
                      ) : (
                        <div className="font-family-roboto total">
                          <Skeleton count={1} width={120}/>
                        </div>
                      )}
                      <div>
                        <ProductConsumer>
                          {(value) => {
                            return (
                              <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                  this.addToCart(value.addToCart);
                                }}
                              >
                                Add to cart
                              </button>
                            );
                          }}
                        </ProductConsumer>
                      </div>
                    </div>
                  </div>
                </div>
              
              </>
            ) : (
              <div className="-error">Page not found!</div>
            )}
          </div>
        </div>
      </section>
    );
  }
}
