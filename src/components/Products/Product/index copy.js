import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./index.scss";
import {ProductConsumer} from '../../../context'
export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addToCart = (addToCart ) => {
      addToCart(this.props.product);
      
  }


  render() {
    const { title, product_image, price, id, available } = this.props.product;
    return (
      <React.Fragment>
        <div className="col-md-3 col-lg-3 col-sm-6 p-0 mb-3">
          <div className="products">
            <Link
              to={"/product-details/" + id + "/" + title.split(" ").join("-")}
            >
              <div className="img-container">
                <img
                  src={product_image}
                  alt="product"
                  className="card__img-top"
                ></img>
              </div>
              </Link>
              <div className="card__body">
                <h5 className="mb-auto product-title">{title}</h5>
                <div id="card_footer">
                  <div className="product-price">{"\u20A6" + price}</div>
                  <ProductConsumer>
                          {(value) => {
                            return (
                              <button
                                className="btn"
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
