import React, { Component } from "react";
import fire from "../../firebase";
import CardSkeleton from "../Utils/CardSkeleton";
import "./index.scss";
import Product from "../Products/Product/index";
import { Link } from "react-router-dom";
export default class index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      showItems: 8,
    };
  }
  //let todos = [];
  componentDidMount() {
    const db = fire.firestore();
    db.collection("products")
      //.orderBy('createdAt', 'desc')
      .get()
      .then((data) => {
        let products = [];
        data.forEach((doc) => {
          products.push({
            id: doc.id,
            available: doc.data().available,
            categoryId: doc.data().categoryId,
            price: parseInt(doc.data().price),
            product_image: doc.data().product_image,
            title: doc.data().title,
          });
        });
        //console.log("products: " + products);
        this.setState({
          products: [
            ...products,
          ],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  render() {
    const { products } = this.state;
    return (
      <div>
        <section className="home-products">
          <h2 className="">Explore our meals</h2>
          <div className="row products-list pt-2">
            {products.length > 0 ? (
              <React.Fragment>
                {products.slice(0, this.state.showItems).map((product) => {
                  return (
                    <Product
                      key={product.id}
                      product={product}
                      history={this.props.history}
                    />
                  );
                })}
              </React.Fragment>
            ) : (
              <CardSkeleton />
            )}
            <div className="col-md-12 p-0">
              <Link to="/menu">
                <button className="btn seemore-btn mb-4">See More</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
