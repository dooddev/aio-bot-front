import React from 'react';
import s from './Popup.module.css'
import {useSelector} from "react-redux";
import {selectTheme} from "../../../scripts/store/slices/app/selectors";
const PopUp = ({text,isOpen,changeOpen,isConfirmButton,confirmFunction}) => {
    const theme=useSelector(selectTheme)
    return (
        isOpen&&
        <div className={s.container_popup} >

            <div   className={`${s.popup} ${s[`popup_${theme}`]}`}>
               <button className={s.btn} onClick={()=>changeOpen(false)} />
                <p className={s.text}>
                    {text}
                </p>
                {isConfirmButton&&<button className={s.confirm_btn} onClick={confirmFunction}>Confirm delete</button>}


            </div>

        </div>
    );
};

export default PopUp;
