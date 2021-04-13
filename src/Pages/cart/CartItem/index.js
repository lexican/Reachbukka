import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { numberWithCommas } from "../../../components/Utils/util";
// const REACT_APP_HOSTNAME = process.env.REACT_APP_HOSTNAME;

// const {parse, stringify} = require('flatted');

// function optionsList(options) {
//   var productOptions = JSON.parse(options);
//   var options = [];
//   var option = "";
//   if (options) {
//     productOptions.map((item) => {
//       options.push(item.name)
//     })
//   }

//   option = options.join(", ");

//   if(option.length > 30){
//     return (
//       <span>
//         {option.slice(0, 30) + "..."}
//       </span>
//     )
//   }else{
//     return (
//       <span>
//       {option}
//     </span>
//     )

//   }
// }

//            {optionsList(options)}

// const newItem = {
//   product_id: product.id,
//   available: product.available,
//   categoryId: product.categoryId,
//   price: product.price,
//   product_image: product.product_image,
//   title: product.title,
//   cart_id: uuidv4(),
//   count: 1,
//   total: product.total
// };

export default function CartItem({ item, value }) {
  const { cart_id, title,  product_image, count, total } = item;
  const { increment, decrement, removeItem } = value;
  return (
    <React.Fragment>
      <div class="item">
        <div class="v1">
          <img src={product_image} alt={title} className="image" />
          <div class="description">
            <span>{title}</span>
            <div class="total-price sm-price">{"\u20A6" + numberWithCommas(total)}</div>
            <div></div>
          </div>
        </div>
        <div className="v2">
          <div class="quantity">
            <button
              class="plus-btn"
              type="button"
              name="button"
              onClick={() => increment(cart_id)}
            >
              <FontAwesomeIcon icon="plus" className="grey_uu" />
            </button>
            <div className="_i_9iri">{count}</div>
            <button
              class="minus-btn"
              type="button"
              name="button"
              onClick={() => decrement(cart_id)}
            >
              <FontAwesomeIcon icon="minus" className="grey_uu" />
            </button>
          </div>
          <div class="total-price">{"\u20A6" + numberWithCommas(total)}</div>
        </div>

        <div className="v3">
          <div class="buttons" onClick={() => removeItem(cart_id)}>
            <span class="delete-btn">
              <FontAwesomeIcon icon="times" className="grey_uu" />
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}


// <button className="delete-btn-bt btn" onClick={() => removeItem(cart_id)}>
// Remove
// </button>