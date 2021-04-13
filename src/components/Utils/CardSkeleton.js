import React from "react";
import Skeleton from "react-loading-skeleton";
import "./index.scss";

export default function CardSkeleton() {
  return (
    <>
      {Array(8)
        .fill()
        .map((item, index) => (
          <div className="col-md-3 col-lg-3 col-sm-6 p-0 mb-3">
            <div className="products">
              <div className="img-container">
                <Skeleton height={200} />
              </div>
              <div className="card__body">
              <h5 className="mb-auto product-title"><Skeleton width={`100%`}/></h5>
              <Skeleton width={`80%`} height={20}/>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
