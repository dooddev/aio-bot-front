import React, {useState} from 'react';
import s from './Modal.module.css'
import MyDetailsPage from "./MyDetailsPage";
import AccountPage from "./AccountPage";
import PasswordPage from "./PasswordPage";
import {useSelector} from "react-redux";
import { selectTheme} from "../../../scripts/store/slices/app/selectors";
const SettingsModal = ({isOpen,setIsOpen}) => {
    const [activePage,setActivePage]=useState(0)
    const theme=useSelector(selectTheme)
    const changePage=(value)=>{
        setActivePage(value)
    }
    return (
        isOpen&&
        <div className={s.modal_container}>
            <div  className={`${s.modal} ${s[`modal_${theme}`]}`}>
                <div className={s.header}>
                    <button onClick={()=>setIsOpen(false)} className={s.btn}>Save</button>
                    <button onClick={()=>setIsOpen(false)} className={s.btn} style={{background:'#F03C5C'}}>Cancel</button>
                </div>
                <h3 className={s.header_text}>Settings</h3>
                <p className={s.text}>Manage your account settings and preferences.</p>
                <div className={s.tab}>
                    <p className={`${s.tab_item} ${activePage===0&&s.active_item} `} onClick={()=>changePage(0)}>My details</p>
                    <p className={`${s.tab_item} ${activePage===1&&s.active_item} `} onClick={()=>changePage(1)}>Account</p>
                    <p className={`${s.tab_item} ${activePage===2&&s.active_item}  `} onClick={()=>changePage(2)}>Password</p>
                    <p  className={`${s.tab_item} ${activePage===3&&s.active_item} ${s.disabled}`} onClick={()=>changePage(3)}>Billing</p>
                    <p className={`${s.tab_item} ${activePage===4&&s.active_item} ${s.disabled}`} onClick={()=>changePage(4)}>Plan</p>
                    <p className={`${s.tab_item} ${activePage===5&&s.active_item} ${s.disabled} `} onClick={()=>changePage(5)}>Integration</p>
                    <p className={`${s.tab_item} ${activePage===6&&s.active_item} ${s.disabled}  `} onClick={()=>changePage(6)}>Notifications</p>
                </div>
                {activePage===0&& <MyDetailsPage/>}
                {activePage===1&&<AccountPage/>}
                {activePage===2&&<PasswordPage/>}

            </div>
        </div>
    );
};

export default SettingsModal;
