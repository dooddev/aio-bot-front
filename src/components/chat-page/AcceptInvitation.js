import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { environment } from "../../environment";
import axios from "axios";
import { useAcceptInvitationQuery } from "../../scripts/api/chat-api";
import ProgressBar from "../common/progress-bar/ProgressBar";

export default function AcceptInvitation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const chat_session = queryParams.get("session");
  const { data, isError, isSuccess } = useAcceptInvitationQuery({
    session: chat_session,
    token: token,
  });

  const BASE_URL = environment.BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (data && isSuccess) {
      navigate(`/chat?session=${chat_session}&token=${token}`);
    } else if (!data && isError) {
      navigate("/login");
    }
  }, [data]);

  // useEffect(() => {
  //     new Promise((resolve, reject) => {
  //         const res = axios.get(
  //             `${BASE_URL}/v2/chat/accept-invitation?token=${token}`
  //         );
  //
  //         if (res.error) {
  //             navigate("/login");
  //         } else {
  //             navigate(`/chat?token=${token}`);
  //         }
  //     });
  // }, []);

  return (
    <ProgressBar add_style={{ background: "rgba(9, 1, 25)", opacity: 1 }} />
  );
}
