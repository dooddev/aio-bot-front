import React from 'react';
import s from './SideBar.module.css'
const SideBar = () => {
    const active='about'
    return (
        <div className={s.sidebar}>
            <div  className={`${s.item} ${active==="developers"&&s.active_item}`}>Developers</div>
            <div  className={`${s.item} ${active==="gamers"&&s.active_item}`}>Gamers</div>
            <div  className={`${s.item} ${active==="docs"&&s.active_item}`}>Docs</div>
            <div  className={`${s.item} ${active==="about"&&s.active_item}`}>About</div>

        </div>
    );
};

export default SideBar;
