import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./index.scss";
import { ProductConsumer } from "../../../context";
import { toast } from "react-toastify";
export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addToCart = (addToCart) => {
    addToCart(this.props.product);
  };

  render() {
    const { title, product_image, price, id, available } = this.props.product;
    return (
      <React.Fragment>
        <div className="col-md-3 col-lg-3 col-sm-6 p-0 mb-3">
          <div className="products">
            <div className="img-container">
              <img
                src={product_image}
                alt="product"
                className="card__img-top"
              ></img>
            </div>

            <div className="card__body">
              <h5 className="product-title">{title}</h5>
              <div className="product-price">{"\u20A6" + price}</div>
              <ProductConsumer>
                {(value) => {
                  return (
                    <button
                      className="btn"
                      onClick={(e) => {
                        this.addToCart(value.addToCart);
                        toast.info("Item has been added to your cart", {
                          position: "bottom-left",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                        });
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
      </React.Fragment>
    );
  }
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    product_image: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
};

// <Link
// to={"/product-details/" + id + "/" + title.split(" ").join("-")}
// >
// <button className="btn" id="quick_view">
//   Quick View
// </button>
// </Link>