import React, {useState} from 'react';
import s from './Modal.module.css'
import {useDispatch, useSelector} from "react-redux";
import {selectMe} from "../../../scripts/store/slices/chat/selectors";
import {useDeleteUserMutation, useLogoutQuery} from "../../../scripts/api/auth-api";
import Cookies from "js-cookie";
import {clearLocalStorage} from "../../../scripts/common/helpers/localStorage";
import {setIsAuth} from "../../../scripts/store/slices/app/app-slices";
import {setMe} from "../../../scripts/store/slices/chat/chat-slice";
import {useNavigate} from "react-router-dom";
import PopUp from "../popup/PopUp";
const AccountPage = () => {

    const [skip, setSkip] = useState(true);
    const [isPopup,setIsPopup]=useState(false)

    const me=useSelector(selectMe)
    const { data } = useLogoutQuery(undefined, { skip });
    const [deleteUser]=useDeleteUserMutation()

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        setSkip(false);
        Cookies.remove("refresh-token");
        clearLocalStorage("access-token");
        dispatch(setIsAuth(false));
        dispatch(setMe(null));
        navigate("/login-page");
    };

    const confirmDialog=()=>{
        setIsPopup(true)

    }

    const handleDeleteUser=()=>{
        setIsPopup(false)
        deleteUser(me.id)
        navigate("/login-page");
    }


    const formatDate = (originalDateString) => {
        const originalDate = new Date(originalDateString);
        const formattedDate = originalDate.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
        return formattedDate;
    };


    return (
        <div>
            <div className={s.account_created}>
                {/*<div>*/}
                <p className={s.name}>{me.username||me.email}</p>
                {/*<p>Connected accounts:</p>*/}
                {/*</div>*/}
                {me.created_at&&
                    <p>
                        Member since: {formatDate(me.created_at)}
                    </p>
                }

            </div>
            <div className={s.account_container}>
                <p  className={s.header_text}>Security</p>
                <div className={s.flex_container}>
                    <p  className={s.text}>Log out of all sessions except for this current browser</p>
                    <button className={s.btn}   onClick={() => handleLogout()}> Log out </button>
                </div>
            </div>
            <div  className={s.account_container}>
                <p   className={s.header_text}>Delete account</p>
                <div className={s.flex_container} >
                    <p  className={s.text}>Delete your account and remove all personal data</p>
                    <button className={s.btn} onClick={()=>confirmDialog()}> Delete</button>
                </div>
            </div>

        <PopUp isOpen={isPopup}
               isConfirmButton={true}
               confirmFunction={handleDeleteUser}
               text={'Are you sure you want to delete your account\n' +'and all the personal information?'}
               changeOpen={(value)=>setIsPopup(value)}/>
        </div>
    );
};

export default AccountPage;
