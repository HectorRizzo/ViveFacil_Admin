import React, { Component } from "react";
import { Link } from "react-router-dom";
import admin from "../img/admin.png";
import tome_logo from "../img/tome.jpg"
import './indexPage.css'
class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            < >
                <Link to="/inicio">

                    <div className="container">
                        <div className="background">
                            <img className="background-img" he src={admin} alt="Login Meme" />
                        </div>
                        <div class="credentials">
                            <div className="logo-div">
                                <img src={tome_logo} className="logo-login" alt="Logo" />
                            </div>
                            <div className="form">

                            </div>
                        </div>

                    </div>


                </Link>

            </>
        );
    }
}

export default IndexPage;