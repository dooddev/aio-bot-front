import React, { useState } from 'react';
import s from './SideBar.module.css';
import hamburger from '../../../assets/img/hamburger.svg';
import close from '../../../assets/img/x-close.svg'

const SideBar = () => {
    const active = 'about';
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div className={s.menu} onClick={handleMenuClick}>
                <img src={hamburger}  />
            </div>

            <div className={`${s.sidebar} ${isOpen ? s.open : ''}`}>
                <div className={`${s.close_btn} ${isOpen ? s.close_btn_active : ''}`}  onClick={handleMenuClick}>

                    <img src={close} />
                </div>
                <div className={`${s.item} ${active === 'developers' && s.active_item}`}>Developers</div>
                <div className={`${s.item} ${active === 'gamers' && s.active_item}`}>Gamers</div>
                <div className={`${s.item} ${active === 'docs' && s.active_item}`}>Docs</div>
                <div className={`${s.item} ${active === 'about' && s.active_item}`}>About</div>
            </div>
        </div>
    );
};

export default SideBar;
