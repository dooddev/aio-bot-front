import React, {useState} from 'react';
import history_img from "../../../assets/img/hamburger.svg";
import chat_img from "../../../assets/img/message.svg";
import invite_friend from "../../../assets/img/invite_friend.svg";
import settings_img from "../../../assets/img/settings.svg";
import s from './BottomNavBar.module.css'
import {useDispatch} from "react-redux";
import {setPage} from "../../../scripts/store/slices/app/app-slices";

const BottomNavBar = () => {

    const dispatch=useDispatch()

    const handleSetPage=(page)=>{
        dispatch(setPage(page))
    }
    return (
        <div className={s.nav}>
            <div onClick={()=>{handleSetPage('history')}} className={s.nav_item}>
                <img src={history_img}/>
            </div>
            <div onClick={()=>{handleSetPage('chat')}} className={s.nav_item}>
                <img src={chat_img}/>
            </div>

            <div onClick={()=>{handleSetPage('friends')}} className={s.nav_item}>
                <img src={invite_friend}/>
            </div>

            <div onClick={()=>{handleSetPage('settings')}} className={s.nav_item}>
                <img src={settings_img}/>
            </div>
        </div>
    );
};

export default BottomNavBar;
