import React from 'react';
import s from './ProgressBar.module.css'
import  loading from '../../../assets/img/loading.gif'
const ProgressBar = ({add_style}) => {
    return (
        <div style={add_style} className={s.progress_container}>
            <img className={s.loading} src={loading}/>
        </div>
    );
};

export default ProgressBar;
