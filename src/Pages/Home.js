import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import Work from "../components/works/index";
import Products from "../components/HomeProducts/index";
import Footer from "../components/Footer/Footer";
import NavbarHome from "../components/NavbarHome";
export default class Home extends Component {
  render() {
    return (
      <div id="home">
        <section className="banner">
          <NavbarHome history={this.props.history} />
          <div className="hero-inner">
            <p>Get the best tasty meal at the cheapest prizes</p>
            <div className="d-flex justify-content-center">
              <Link to="/menu">
                <button className="btn banner-btn">Explore our meals</button>
              </Link>
            </div>
          </div>
        </section>
        <Work />
        <Products />
        <Footer />
      </div>
    );
  }
}
