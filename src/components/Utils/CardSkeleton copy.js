import React from "react";
import Skeleton from "react-loading-skeleton";

export default function CardSkeleton() {
  return (
    <>
      {Array(9)
        .fill()
        .map((item, index) => (
          <div className="col-md-4 col-lg-4 col-sm-6 p-0 mb-3">
            <div className="card">
                  <div className="products">
                    <div className="img-container">
                      <Skeleton height={190} />
                    </div>
                    <div className="card__body">
                        <Skeleton width={`90%`} />
                        <Skeleton width={`60%`} />
                    </div>
                  </div>
            </div>
          </div>
        ))}
    </>
  );
}