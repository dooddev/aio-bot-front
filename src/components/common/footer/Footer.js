import React from 'react';
import s from './Footer.module.css'
const Footer = () => {
    return (
        <div className={s.footer}>
            <div className={s.line}></div>
            <p className={s.footer_top}>AIOHub Inc. 2024</p>
            <div className={s.footer_bottom}>
                <p>Privacy Policy</p>
                <p>Terms of Use</p>
            </div>
        </div>
    );
};

export default Footer;
