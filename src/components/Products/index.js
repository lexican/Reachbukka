import React, { Component } from "react";
import { ProductConsumer } from "../../context";
import Product from "./Product/index";
import CardSkeleton from "../Utils/CardSkeleton";
export default class ProductList extends Component {
  render() {
    return (
      <React.Fragment>
        <ProductConsumer>
          {(value) => {
            const { filteredProducts } = value;
            return (
              <>
                {filteredProducts != null && (
                  <React.Fragment>
                    {filteredProducts.map((product) => {
                      return <Product key={product._id} product={product} />;
                    })}
                  </React.Fragment>
                )}
                {!filteredProducts && <CardSkeleton />}
              </>
            );
          }}
        </ProductConsumer>
      </React.Fragment>
    );
  }
}
