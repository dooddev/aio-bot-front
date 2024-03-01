import React from 'react';
import s from "./Auth.module.css";
import logo from "../../assets/img/logo.png";

const InformPage = () => {
    return (
        <div className={s.container}>
            <p  style={{color: 'rgba(255, 255, 255, 0.75)',fontWeight: 300}}>We have sent a link to reset your password to your email. Please check your email</p>
        </div>
    );
};

export default InformPage;
