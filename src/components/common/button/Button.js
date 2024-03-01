import React from 'react';
import s from './Button.module.css'
const Button = ({text,onClick,type,error,style}) => {
    const styleError=error&&s.error_button
    return (

            <button
                type={type}
                onClick={()=>onClick()}
                className={`${s.button} ${styleError}`}
                style={{...style}}
            >
                {text}
            </button>

    );
};

export default Button;
