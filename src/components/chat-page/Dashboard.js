import React, { useContext, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataContext } from "../../App";
import { environment } from "../../environment";
import s from "./Chat.module.css";
import LeftSidebar from "./LeftSidebar";
import logo from "../../assets/img/logo.png";
import User from "./User";
import pen from "../../assets/pen.gif";
import RightSidebar from "./RightSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { selectMe } from "../../scripts/store/slices/chat/selectors";
import { selectFriends } from "../../scripts/store/slices/friend/selectors";
import { setFriends } from "../../scripts/store/slices/friend/friend-slice";
import {
  addMessages,
  setMessages,
} from "../../scripts/store/slices/chat/chat-slice";
import { selectMessages } from "../../scripts/store/slices/chat/selectors";
import {
  selectIsAuth,
  selectTheme,
} from "../../scripts/store/slices/app/selectors";
import { useSocket } from "../../scripts/hooks/useSocket";
import {
  useSendMessageMutation,
  useCheckChatSessionMutation,
  useGetFriendListBySessionMutation,
  useChatHistoryBySessionMutation, useSendVoteMutation,
  // useChatSessionsByIdQuery
} from "../../scripts/api/chat-api";
import red_like from '../../assets/img/red_like.svg'
import white_like from '../../assets/img/white_like.svg'
const Dashboard = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const [getFriendListBySession] = useGetFriendListBySessionMutation();
  const [ChatHistoryBySession] = useChatHistoryBySessionMutation();
  const [sendVote]=useSendVoteMutation()

  const theme = useSelector(selectTheme);
  const me = useSelector(selectMe);
  const messages = useSelector(selectMessages);
  const friend_list=useSelector(selectFriends)
  console.log('friend list',friend_list)
  console.log('messages',messages)

  const { socket, isConnected } = useSocket();
  const ref = useRef();
  const { data, setData } = useContext(DataContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const session = queryParams.get("session");

  const handleSendVote=(id)=>{


    const res = sendVote({id:id,mode:'up'})
    if(res.error){
      return
    }
    const new_messages =messages.map((message)=>message.id===id?{...message,liked:true}:message)
    dispatch(setMessages(new_messages))

  }

  const handleMessage = (data) => {
    console.log("receiving new message");
    if (data.email === me.email) return;
    dispatch(
      addMessages([
        {
          message: data.query,
          sender: "user",
          email: data.email,
        },
        {
          message: data.response,
          sender: "ChatGPT",
          recipient: data.email,
          liked:false
        },
      ])
    );
  };

  useEffect(() => {
    if (isConnected) {
      const getFriendList = async () => {
        const res = await getFriendListBySession({
          session: session,
        });
        if (res.error) return;
        console.log('GET FRIEND LIST',res.data)
        dispatch(setFriends(res.data));
      };

      const getPrevHistory = async () => {
        const res = await ChatHistoryBySession({
          chat_session: session,
        });

        if (res.error) return;

        if (res.length == 0) {
          dispatch(
            setMessages([
              {
                message: "Hello, I am AIO assistant bot. How can I help you?",
                sender: "ChatGPT",
                recipient: me.username,

              },
            ])
          );
        } else {
          for (let msg of res.data.chat_messages) {
            let add_msgs = [];
            add_msgs.push({
              message: msg.query,
              sender: "user",
              email: msg.email,

            });



            if(msg.response.length!=0){
              add_msgs.push({
                message: msg.response,
                sender: "ChatGPT",
                recipient: msg.email,
                id:msg.id,
                liked:msg.status
              });
            }


            dispatch(addMessages(add_msgs));
          }
        }
      };

      // const getChatHistoryList = async () => {
      //   const res = getChatSessionById();
      //   if (res.error) return;
      //   console.log(res.data)
      // }

      getFriendList();
      getPrevHistory();
      // getChatHistoryList();

      socket.emit("set user session", {
        email: me.email,
        session: session,
      });
      socket.on("new chatbot message", handleMessage);
    }
  }, [isConnected]);

  const [checkChatSession] = useCheckChatSessionMutation();

  useEffect(() => {
    const checksession = async () => {
      let res = await checkChatSession({ session: session });
      if (res.error) {
        navigate(`/login?session=${session}`);
      }
    };
    checksession();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      return; // Ignore empty messages
    }
    scrollToBottom();
    dispatch(
      addMessages([
        {
          message: question,
          email: me.email,
          sender: "user",
        },
      ])
    );
    setQuestion("");
    await processMessageToChatGPT(question);
  };
  async function processMessageToChatGPT(message) {
    const query = new FormData();
    console.log(message);
    query.append("query", message);
    query.append("session", session);
    query.append("email", me.email);
    try {
      setIsLoading(true);
      console.log(query);
      const axiosResponse = await sendMessage(query);
      setIsLoading(false);
      const responseData = axiosResponse.data;
      console.log(responseData);
      setData(responseData);
      if (responseData.content != null&&responseData.content.length!='') {
        dispatch(
          addMessages([
            {
              message: responseData.content,
              sender: "ChatGPT",
              recipient: responseData.email,
            },
          ])
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
  const scrollToBottom = () => {
    try {
      ref.current.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      console.log("sw");
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getRecipientName(friendList, messageRecipient, currentUser) {
    if (friendList.length !== 0) {
      const friend = friendList.find((el) => el?.email === messageRecipient);

      return friend?.username !=null?friend?.username:friend?.email
    } else {
      console.log('current user',currentUser)
      if(currentUser){
        return currentUser.username !== null ? currentUser?.username : currentUser?.email;
      }
      else {
        return ''
      }

    }
  }



  return (
    <div style={{ display: "flex", width: "100%" }}>
      <LeftSidebar />

      <div className={`${s.container} ${s[`container_${theme}`]}`}>
        <p className={`${s.text}  ${s.bold_text}   ${s[`text_${theme}`]}`}>
          AIOChat Bot 1.0
        </p>

        <div className="flex flex-col-reverse p-0 items-start w-[80%] h-full overflow-y-auto chat-section">
          <div className="flex flex-col gap-3 w-full">
            {messages.map((message, index) =>
              message.sender === "ChatGPT" ? (
                <div key={`chatbot-message-node-${index}`}>
                  <div className={`${s.message}`} key={index}>
                    <p className={` ${s[`message_${theme}`]}`}>
                      {message.message}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "40px",alignItems:'center' }}>
                    <div className={s.logo_container}>
                      <img src={logo} className={s.logo_avatar} />
                      <p className={`${s[`name_${theme}`]}`}>
                        {" "}
                        AIOBot to {getRecipientName(friend_list, message.recipient, me)}
                      </p>
                    </div>
                    {message.liked
                        ? <img src={red_like} className={s.like} />
                        :<img src={white_like} className={s.like} onClick={()=>handleSendVote(message.id)}/>
                    }

                  </div>
                </div>
              ) : (
                <div
                  key={`chatbot-message-node-${index}`}
                  className={s.message_container}
                >
                  <div>
                    <div
                      className={`${s.my_message}`}
                      style={{ marginBottom: "15px" }}
                      key={index}
                    >
                      <p className={`${s[`message_${theme}`]}`}>
                        {message.message}
                      </p>
                    </div>
                    <User
                        user={
                          friend_list.length!=0?
                              friend_list.find(
                                  (friend) => friend.email === message.email
                              ):me
                        }
                    />
                  </div>
                </div>
              )
            )}
            <div ref={ref} className="-mt-3" />
          </div>
        </div>

        {isLoading && (
          <div className={s.type_container}>
            <img src={pen} />
            <span>AIOBot is typing....</span>
          </div>
        )}
        <div
          className=" w-full items-center justify-center flex"
          style={{ bottom: 0 }}
        >
          <div className={s.border}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`${s.input} ${s[`input_${theme}`]}`}
              placeholder="Ask me anything"
              style={{ borderRadius: "12px" }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleSend(event);
                }
              }}
            />
          </div>
        </div>
        <p className={`${s.text} ${s[`text_${theme}`]}`}>
          We are constantly training our AI to provide you with the best
          results. Please be patient.
        </p>
      </div>
      <RightSidebar />
    </div>
  );
};
export default Dashboard;
