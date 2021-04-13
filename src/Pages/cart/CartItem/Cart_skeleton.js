import React from 'react'
import Skeleton from "react-loading-skeleton";

export default function Cart_skeleton() {
    return (
        <>
          {Array(4)
            .fill()
            .map((item, index) => (
                <div class="item">
                <div class="">
                    <Skeleton height={120} />
                </div>
        
                <div class="description">
                  <span><Skeleton width={`90%`} /></span>
                  <div>
                   
                  </div>
                </div>
        
                <div class="quantity">
                  <button class="plus-btn" type="button" name="button">
                  <Skeleton width={`60%`} />
                  </button>
                  <div className="_i_9iri"><Skeleton width={`90%`} /></div>
                  <button class="minus-btn" type="button" name="button">
                  <Skeleton width={`60%`} />
                  </button>
                </div>
                <div class="total-price"><Skeleton width={`60%`} /></div>
                <div class="buttons">
                  <span class="delete-btn">
                  <Skeleton width={`90%`} />
                  </span>
                </div>
              </div>

            ))}
        </>
      );
}