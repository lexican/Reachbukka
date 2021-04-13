import React, { Component } from "react";
//import ProductList from "./Products";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer/Footer";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProductConsumer } from "../../context";
import { Tab } from "./Tab";
import "./index.scss";
import ProductList from "../../components/Products/index";
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div id="menu">
        <Navbar />
        <section className="menu">
          <div className="fil-24 pl-0 py-4">
            <ProductConsumer>
              {(value) => {
                const { filterItems } = value;
                return <Tab filter={filterItems} />;
              }}
            </ProductConsumer>
          </div>
          <div className="container-main">
            <div className="row products-list">
              <ProductList />
            </div>
          </div>
          <ProductConsumer>
            {(value) => {
              const { filteredProducts } = value;
              return (
                <div className="">
                  {filteredProducts != null && filteredProducts.length == 0 && (
                    <div className="empty">No Item Found</div>
                  )}
                </div>
              );
            }}
          </ProductConsumer>
          <Footer />
        </section>
      </div>
    );
  }
}

//              <ProductList />
