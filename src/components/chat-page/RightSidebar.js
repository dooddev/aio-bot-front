import React, { useState } from "react";
import { enqueueSnackbar } from "notistack";
import s from "./Chat.module.css";
import User from "./User";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {selectPage, selectTheme} from "../../scripts/store/slices/app/selectors";
import { useSendInvitationMutation } from "../../scripts/api/chat-api";
import { selectMe } from "../../scripts/store/slices/chat/selectors";
import PopUp from "../common/popup/PopUp";
import ProgressBar from "../common/progress-bar/ProgressBar";
import { selectFriends } from "../../scripts/store/slices/friend/selectors";
import { useGetFriendListBySessionMutation } from "../../scripts/api/chat-api";
import { setFriends } from "../../scripts/store/slices/friend/friend-slice";
import ThemeComponent from "../common/theme/ThemeComponent";
const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [friend_email, setFriendEmail] = useState("");
  const [isPopup, setIsPopup] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chat_session = queryParams.get("session");

  const theme = useSelector(selectTheme);
  const me = useSelector(selectMe);
  const friend_list = useSelector(selectFriends);
  const page=useSelector(selectPage)

  const [sendInvitation, { isLoading }] = useSendInvitationMutation();
  const [getFriendListBySession] = useGetFriendListBySessionMutation();



  const onSendInvitation = async () => {
    if (friend_email == "") {
      enqueueSnackbar("Please input recipient email", { variant: "warning" });
      return;
    }

    let res = await sendInvitation({
      from_id: me.id,
      friend_email: friend_email,
      chat_session: chat_session,
    });
    if (res.error) {
      enqueueSnackbar(res.error.message, {
        variant: "error",
      });
      return;
    }
    enqueueSnackbar(`Invitation email is sent to ${friend_email}`, {
      variant: "success",
    });

    res = await getFriendListBySession({
      session: chat_session,
    });
    if (res.error) return;
    dispatch(setFriends(res.data));

    setFriendEmail("");
    setIsOpen(false);
  };

  return (
    <div
      className={`${s.container_sidebar} ${s[`container_sidebar_${theme}`]}  ${page==='friends' ? s.righrside_full_page : ''}`}
    >
      <div className={s.container_theme}>
        <ThemeComponent/>
      </div>

      <div
        className={`${s.sidebar_btn} ${s[`sidebar_btn_${theme}`]}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        Invite a friend
      </div>

      <div
        className={s.invite_friends}
        style={{ display: isOpen ? "flex" : "none" }}
      >
        <input
          className={`${s.input_invite} ${s[`input_invite_${theme}`]}`}
          value={friend_email}
          onChange={(e) => setFriendEmail(e.target.value)}
          placeholder="Please enter your friend’s email"
        />

        <button
          className={`${s.btn_invite} ${s[`btn_invite_${theme}`]}`}
          disabled={isLoading}
          onClick={() => onSendInvitation()}
        >
          send
        </button>
      </div>

      <div className={s.line}></div>
      <div className={s.friends_list}>
        {friend_list &&
            friend_list.map((user, idx) => (
                <User key={`right-sidebar-user-${idx}`} isOpen={false} user={user} />
            ))}
      </div>


      <PopUp
        text={"Changes have been saved!"}
        isOpen={isPopup}
        changeOpen={(value) => setIsPopup(value)}
      />
      {isLoading && <ProgressBar />}
    </div>
  );
};

export default RightSidebar;
