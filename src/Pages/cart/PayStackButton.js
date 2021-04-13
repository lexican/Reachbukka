import React from 'react'
import { usePaystackPayment} from 'react-paystack';
const REACT_APP_PAYSTACKPUBLICKEY = process.env.REACT_APP_PAYSTACKPUBLICKEY;
const REACT_APP_EMAIL = process.env.REACT_APP_EMAIL;

export default function PayStackButton(props) {

    const config = {
        reference: (new Date()).getTime(),
        email: REACT_APP_EMAIL,
        amount: props.total,
        publicKey: REACT_APP_PAYSTACKPUBLICKEY
    };
    const initializePayment = usePaystackPayment(config);

    return (
        <div>
            <button onClick={() => {
                    initializePayment()
                }}
                disabled={props.isValid}>Paystack Hooks Implementation</button>
        </div>
    )
}
