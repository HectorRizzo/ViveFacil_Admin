import React, { Component } from "react";
import { Link } from "react-router-dom";
import admin from "../img/admin.png";
import tome_logo from "../img/tome.jpg"
import MetodosAxios from "../requirements/MetodosAxios";
import eye_password from "../img/icons/eye_password.png"
import hidden_password from "../img/icons/hidden_password.png"
import './indexPage.css'
class IndexPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            pass: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.connect = this.connect.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    connect(){
        let user = this.state.user
        let pass = this.state.pass

        MetodosAxios.obtener_admin_user_pass(user, pass).then(res => {
            if(res.data["token"]){
                this.props.history.push({pathname: 'inicio', state: {detail: res.data}})
            }
        })

    }

    visibility (){
        console.log('test')
        var password = document.getElementById('login-pass')
        var type = password?.getAttribute('type');
        var eyes = document.getElementById('eye-img')
        if (type == 'password') {
            password?.setAttribute('type', 'text');
            eyes?.setAttribute('src', eye_password);
        } else {
            password?.setAttribute('type', 'password');
            eyes?.setAttribute('src', hidden_password);
        }
    }

    render() {

        return (
            < >
                

                    <div className="container">
                        <div className="background">
                            <img className="background-img" he src={admin} alt="Login Meme" />
                        </div>
                        
                            <div class="credentials">
                                <Link to="/inicio">
                                    <div className="logo-div">
                                        <img src={tome_logo} className="logo-login" alt="Logo" />
                                    </div>
                                </Link>
                                <div className="form">
                                    <div class="login">
                                    <div class="login-screen">

                                        <div class="login-form">
                                        <div class="control-group">
                                            <input type="text" class="login-field" onChange={this.handleChange} required placeholder="username" id="login-name" name="user" key="input-name"></input>
                                            <label class="login-field-icon fui-user" for="login-name"></label>
                                        </div>

                                        <div class="control-group ">
                                            <input type="password" class="login-field" onChange={this.handleChange} required placeholder="password" id="login-pass" name="pass" key="input-pass"></input>
                                            <img className={'eye-img'} id="eye-img" src={hidden_password} alt={hidden_password} onClick={this.visibility} />
                                        </div>

                                        <a class="btn btn-primary btn-large btn-block" href="#"  onClick={this.connect}>login</a>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>

                    </div>
            </>
        );
    }
}

export default IndexPage;