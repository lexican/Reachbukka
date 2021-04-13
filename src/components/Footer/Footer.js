import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './footer.scss'

var d = new Date();
var n = d.getFullYear();


export default class Footer extends Component {
    render() {
        return (
            <section className="footer">
                <div>
                    <div className="row">
                        <div className="col-md-4">
                            <div>
                                <p></p>
                                <p className="text-center">121 Rock Sreet, 21 Avenue, Surulere, Lagos</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div>
                                <p></p>
                                <p className="text-center">Mon-Sat: 08.00 AM – 8:00 PM</p>
                                <p className="text-center">Sun: 10:00AM – 5:00 PM</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <p></p>
                            <p className="text-center">Reservation Number:</p>
                            <p className="text-center">+2349000000000 or +2349000000000</p>
                        </div>
                    </div>
                    <div className="social-icons">
                        <div className="vc_column-inner">
                            <div className="wpb_wrapper">
                                <div className=" uavc-icons-center uavc-icons">
                                    <Link className="aio-tooltip" to="#">
                                        <div className="aio-icon circle">
                                            <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                                        </div>
                                    </Link>
                                    <Link className="aio-tooltip" to="#">
                                        <div className="aio-icon circle">
                                            <FontAwesomeIcon icon={['fab', 'twitter']} />
                                        </div>
                                    </Link>
                                    <Link className="aio-tooltip" to="#">
                                        <div className="aio-icon circle">
                                            <FontAwesomeIcon icon={['fab', 'instagram']} />
                                        </div>
                                    </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-center my-0">&copy;2020 - {n} Gritza Inc. All Rights Reserved.</p>
                    </div>
                </div>
            </section>
        )
    }
}
