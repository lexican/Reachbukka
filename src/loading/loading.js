import React from "react";
import './loading.scss'
import Loading from "./loading.svg"
export default function loading() {
  return (
    <div className="loading">
      <img src={Loading} className="loading-spinner" alt="Loading" />
    </div>
  );
}
