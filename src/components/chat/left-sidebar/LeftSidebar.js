import User from "../../common/user/User";
import React, { useContext,useState, useEffect } from "react";
import logo from "../../../assets/img/logo.png";
import s from "./LeftSidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import {selectPage, selectTheme} from "../../../scripts/store/slices/app/selectors";
import { selectMe } from "../../../scripts/store/slices/chat/selectors";
import { selectMessages } from "../../../scripts/store/slices/chat/selectors";
import { useCreateNewSessionMutation } from "../../../scripts/api/chat-api";
import { enqueueSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ContextSocket,
} from "../../../scripts/context/SocketContext";
import { setMessages } from "../../../scripts/store/slices/chat/chat-slice";
import { useChatSessionsByIdQuery } from "../../../scripts/api/chat-api";
import { setFriends } from "../../../scripts/store/slices/friend/friend-slice";
import {setPage} from "../../../scripts/store/slices/app/app-slices";

const LeftSidebar = () => {
  const theme = useSelector(selectTheme);
  const me = useSelector(selectMe);
  const chat_messages = useSelector(selectMessages);
  const page=useSelector(selectPage)

  const navigate = useNavigate();
  const [createNewSession] = useCreateNewSessionMutation();
  const { data: chathistory_sessions, refetch } = useChatSessionsByIdQuery({
    user_id: me.id,
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const session = queryParams.get("session");

  const socket = useContext(ContextSocket);

  const [current_session, setCurrentSession] = useState({
    id: "1",
    data: "2024-03-06",
    header: "",
  });

  const [historySession, setHistorySession] = useState([]);

  useEffect(() => {
    if (chat_messages.length) {
      setCurrentSession({
        id: "1",
        data: "2024-03-18",
        header: chat_messages[0].message,
      });
    }
  }, [chat_messages]);

  useEffect(() => {
    const data = chathistory_sessions;

    if (!data) return;
    const ret_data = [];
    let idx = 0;
    for (let item of data) {
      ret_data.push({
        id: idx + 1,
        date: item.created_at,
        session: item.session,
        header: item.query,
      });
      idx++;
    }
    console.log(ret_data);
    setHistorySession(ret_data);
  }, [chathistory_sessions]);

  const handleNewChatClick = async () => {
    let res = await createNewSession({
      user_id: me.id,
    });
    if (res.error) {
      enqueueSnackbar("The error occured", { variant: "error" });
      return;
    }
    enqueueSnackbar(res.data.message, { variant: "info" });
    dispatch(setMessages([]));
    dispatch(setFriends([]));

    refetch(); // get chat history list

    const new_session = res.data.session;

    socket.emit("set user session", {
      email: me.email,
      session: new_session,
    });

    setCurrentSession({
      id: "1",
      data: "2024-03-18",
      header: "",
    })
    dispatch(setPage('chat'))
    navigate(`/chat?session=${new_session}`);
  };

  function compareDates(date1, date2) {
    // Extract the year, month, and day from the first date
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    // Extract the year, month, and day from the second date
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    // Compare the year, month, and day
    return year1 === year2 && month1 === month2 && day1 === day2;
  }

  const groupHistoryByTime = () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 1000 * 3600 * 24);
    // const fiveDaysAgo = new Date(today.getTime() - 1000 * 3600 * 24 * 5);

    const todayArray = [];
    const yesterdayArray = [];
    const last5Days = [];

    historySession.forEach((item) => {
      if (compareDates(new Date(item.date), today)) {
        todayArray.push(item);
      } else if (compareDates(new Date(item.date), yesterday)) {
        yesterdayArray.push(item);
      } else {
        last5Days.push(item);
      }
    });

    console.log(todayArray, yesterdayArray, last5Days);

    return { todayArray, yesterdayArray, last5Days };
  };

  const { todayArray, yesterdayArray, last5Days } = groupHistoryByTime();

  const LeftSidebarItem = ({ session, header }) => {
    const handleSidebarItemClick = (session) => {
      window.location.href = `/chat?session=${session}`;
    };

    return (
      <div
        className={`${s.item_history} ${s[`item_history_${theme}`]}`}
        onClick={() => handleSidebarItemClick(session)}
      >
        {header}
      </div>
    );
  };

  return (
    <div
      className={`${s.container_sidebar} ${s[`container_sidebar_${theme}`]} ${page==='history' ? s.leftside_full_page : ''}`}
    >
      <img src={logo} className={s.logo} />
      <div
        className={`${s.sidebar_btn} ${s[`sidebar_btn_${theme}`]}`}
        onClick={handleNewChatClick}
      >
        New chat
      </div>
      <div className={s.line}></div>
      <div
          className={`${s.current_session} ${s[`current_session_${theme}`]}`}
      >
        <p>{current_session.header}</p>
      </div>
      <div className={s.list}>


        {todayArray.length !== 0 && (
          <div>
            <h3
              className={`${s.header_history} ${s[`header_history_${theme}`]}`}
            >
              Today
            </h3>
            {todayArray.map((item) => (
              <LeftSidebarItem
                key={item.id}
                session={item.session}
                header={item.header}
              />
            ))}
          </div>
        )}

        {yesterdayArray.length !== 0 && (
          <div>
            <h3
              className={`${s.header_history} ${s[`header_history_${theme}`]}`}
            >
              Yesterday
            </h3>
            {yesterdayArray.map((item) => (
              <LeftSidebarItem
                key={item.id}
                session={item.session}
                header={item.header}
              />
            ))}
          </div>
        )}

        {last5Days.length !== 0 && (
          <div>
            <h3
              className={`${s.header_history} ${s[`header_history_${theme}`]}`}
            >
              Last 5 Days
            </h3>
            {last5Days.map((item) => (
              <LeftSidebarItem
                key={item.id}
                session={item.session}
                header={item.header}
              />
            ))}
          </div>
        )}
      </div>
      <div className={s.profile}>{me && <User isMenu={true} user={me} />}</div>
    </div>
  );
};

export default LeftSidebar;
