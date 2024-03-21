import React from 'react';
import red_like from "../../../assets/img/red_like.svg";
import s from "../../chat/Chat.module.css";
import white_like from "../../../assets/img/white_like.svg";
import {setMessages} from "../../../scripts/store/slices/chat/chat-slice";
import {useSendVoteMutation} from "../../../scripts/api/chat-api";
import {useDispatch, useSelector} from "react-redux";
import {selectMessages} from "../../../scripts/store/slices/chat/selectors";

const LikeButton = ({message}) => {

    const [sendVote] = useSendVoteMutation();

    const dispatch = useDispatch();

    const messages = useSelector(selectMessages);

    const handleSendVote = (id) => {
        const res = sendVote({ id: id, mode: "up" });
        if (res.error) {
            return;
        }
        const new_messages = messages.map((message) =>
            message.id === id ? { ...message, liked: true } : message
        );
        dispatch(setMessages(new_messages));

    };
    return (
        <div>
            {message.liked ? (
                <img src={red_like} className={s.like} />
            ) : (
                <img
                    src={white_like}
                    className={s.like}
                    onClick={() => handleSendVote(message.id)}
                />
            )}
        </div>
    );
};

export default LikeButton;
