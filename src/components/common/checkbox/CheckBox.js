import React from 'react';
import s from './CheckBox.module.css'
const CheckBox = ({ checked, onChange,children,register,error  }) => {
    const handleCheckboxChange = () => {
        if (onChange) {
            onChange(!checked);
        }
    };

    return (

            <label style={{display:'flex',gap:'20px',width:'100%'}}>
                <input
                    className={s.checkbox}
                    type="checkbox"
                    checked={checked}
                    onChange={handleCheckboxChange}
                    {...(register && register())}
                />
                {children}



            </label>

    );
};

export default CheckBox;
