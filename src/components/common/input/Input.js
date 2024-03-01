import React from 'react';
import s from './Input.module.css'
const Input = ({text,value,placeholder,onChange,error, register,onEnterPress,style,type=text}) => {

    const styleError=error&&s.border_error
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onEnterPress) {
            onEnterPress(e);
        }
    };

    return (
        <div className={s.input_container} >
            <p className={s.text}>{text}</p>
            <div className={`${s.border} ${styleError}`}>
                <input
                    className={`${s.input} `}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    onKeyPress={handleKeyPress}
                    {...(register && register())}
                    style={{...style}}
                />
            </div>

            <span className={s.error_text}>
                  {error}
            </span>

        </div>


    );
};

export default Input;
