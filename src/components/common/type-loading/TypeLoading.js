import React from 'react';
import s from "./TypeLoading.module.css"
import pen from "../../../assets/pen.gif";

const TypeLoading = ({isLoading}) => {
    return (
        <div className={s.type_container} style={{height:isLoading?'220px':'136px'}}>
            {isLoading&&
                <div style={{display:'flex',alignItems:'center'}}>
                    <img src={pen} />
                    <span>AIOBot is typing....</span>
                </div>
            }


        </div>
    );
};

export default TypeLoading;
