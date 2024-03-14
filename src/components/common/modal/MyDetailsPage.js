import React, {useEffect, useRef, useState} from 'react';
import s from "./Modal.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectMe} from "../../../scripts/store/slices/chat/selectors";
import {useChangeAvatarMutation, useChangeUserMutation} from "../../../scripts/api/user-api";
import PopUp from "../popup/PopUp";
import ProgressBar from "../progress-bar/ProgressBar";

import {useGetUserQuery} from "../../../scripts/api/auth-api";
import {enqueueSnackbar} from "notistack";
import {setMe} from "../../../scripts/store/slices/chat/chat-slice";

const MyDetailsPage = () => {
    const me=useSelector(selectMe)

    const [username, setUsername] = useState(me?.username||'');
    const [email,setEmail]=useState(me?.email||'')
    const [avatar,setAvatar]=useState(me?.avatar_url||'')

    const { data: user,refetch,isLoading:loadingGetUser  } = useGetUserQuery(me?.id);
    const [changeUser,{isLoading:loadingChangeUser}]=useChangeUserMutation()
    const [changeAvatar,{isLoading:loadingChangeAvatar}]=useChangeAvatarMutation()

    const fileInputRef = useRef(null);
    const dispatch=useDispatch()


    useEffect(()=>{
        setAvatar(user?.avatar_url)
    },[user])

    const handleChangeName = async () => {
        const res =await changeUser({id:me.id,data:{username}})
        if(res.error){
            enqueueSnackbar('Something went wrong', {
                variant: "error",
            });
            return
        }

        refetch()
        dispatch(setMe({...me,username:username}))

        enqueueSnackbar(`Changes have been saved!`, {
            variant: "success",
        });
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
                enqueueSnackbar('Something went wring', {
                    variant: "error",
                });
                return
            }
            const res=await refetch()

            if(res.data){
                dispatch(setMe(res.data))

                enqueueSnackbar(`Changes have been saved!`, {
                    variant: "success",
                });
            }


        } catch (error) {
            enqueueSnackbar('Something went wring', {
                variant: "error",
            });
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
