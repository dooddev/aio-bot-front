import React, {useEffect, useRef, useState} from 'react';
import s from "./Modal.module.css";
import {useSelector} from "react-redux";
import {selectMe} from "../../../scripts/store/slices/chat/selectors";
import {useChangeAvatarMutation, useChangeUserMutation} from "../../../scripts/api/user-api";
import PopUp from "../popup/PopUp";
import ProgressBar from "../progress-bar/ProgressBar";

import {useGetUserQuery} from "../../../scripts/api/auth-api";
import {enqueueSnackbar} from "notistack";

const MyDetailsPage = () => {
    const me=useSelector(selectMe)
    const [username, setUsername] = useState(me?.username||'');
    const [email,setEmail]=useState(me?.email||'')
    const [avatar,setAvatar]=useState(me?.avatar_url||'')
    const [isPopup,setIsPopup]=useState(false)
    const [textPopup,setTextPopup]=useState('')

    const { data: user,refetch,isLoading:loadingGetUser  } = useGetUserQuery(me?.id);

    const [changeUser,{isLoading:loadingChangeUser}]=useChangeUserMutation()
    const [changeAvatar,{isLoading:loadingChangeAvatar}]=useChangeAvatarMutation()

    const fileInputRef = useRef(null);
    useEffect(()=>{
        setAvatar(user?.avatar_url)
    },[user])

    const handleChangeName = async () => {
        const res =await changeUser({id:me.id,data:{username}})
        if(res.error){
            //setTextPopup('Something went wring')
            enqueueSnackbar('Something went wrong', {
                variant: "error",
            });
            return
        }

        refetch()
        enqueueSnackbar(`Changes have been saved!`, {
            variant: "success",
        });
        // setTextPopup('Changes have been saved!')
        // setIsPopup(true)

    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        await  handleChangePhoto(file)
    };

    const handleChangePhoto = async (file) => {
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const result = await changeAvatar({id:me.id, data:formData});
            if(result.error){
                // setTextPopup('Something went wring')
                enqueueSnackbar('Something went wring', {
                    variant: "error",
                });
                return
            }
            refetch()
            enqueueSnackbar(`Changes have been saved!`, {
                variant: "success",
            });

            // const reader = new FileReader();
            //
            // reader.onloadend = () => {
            //     const base64Image = reader.result;
            //     setAvatar(base64Image);
            //     setTextPopup('Changes have been saved!');
            //     setIsPopup(true);
            // };
            //
            // reader.readAsDataURL(file);

        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    }
    return (
        <div>
            <div className={s.container}>
                <p>Name</p>
                <div className={s.name_container}>
                    <input className={s.input}  value={username}
                           onChange={(e) => setUsername(e.target.value)}/>
                    <button
                        className={s.btn}
                        onClick={handleChangeName}
                    >Change name</button>
                </div>
            </div>
            <div className={s.container}>
                <p>Profile Photo (Optional)</p>
                <div className={s.photo_container}>
                    {avatar?.length!=0?  <img src={avatar} className={s.avatar}/>:
                        <span
                        className={s.avatar}
                        style={{
                            border: "3px solid gray",
                            fontSize: "19px",
                            fontWeight: "bold",
                            color: "white",
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center"
                        }}
                    >
                         {user?.email.charAt(0).toUpperCase()}
                     </span>}



                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <button
                        className={s.btn}
                        onClick={() => fileInputRef.current.click()}
                    >
                        Change photo
                    </button>
                </div>

            </div>
            <div className={s.container}>
                <p>Email</p>
                <input className={s.input} value={email}/>
            </div>
            {/*<div className={s.container}>*/}
            {/*    <p>Description (Optional)</p>*/}
            {/*    <textarea className={s.input}/>*/}
            {/*</div>*/}
            {/*<PopUp text={textPopup} isOpen={isPopup} changeOpen={(value)=>setIsPopup(value)}/>*/}
            {(loadingChangeAvatar||loadingChangeUser||loadingGetUser)&&      <ProgressBar /> }




        </div>
    );
};

export default MyDetailsPage;
