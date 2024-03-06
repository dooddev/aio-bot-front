import { apiService } from "../instance/axiosBaseQuery";

export const chatService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    friends: build.mutation({
      query: (data) => ({ method: "GET", url: `chat/friend_list`, data: data }),
    }),
    getUser: build.query({
      query: (id) => ({ method: "GET", url: `user/${id}` }),
    }),
    sendInvitation: build.mutation({
      query: (data) => ({
        method: "POST",
        url: `chat/invite`,
        data: data,
      }),
    }),
    sendMessage: build.mutation({
      query: (query) => {
        console.log("Query:", query);
        return {
          method: "POST",
          url: "/query_pdf",
          data: query,
        };
      },
    }),
    acceptInvitation: build.query({
      query: (query) => ({
        method: "GET",
        url: `chat/accept-invitation?session=${query.session}&token=${query.token}`,
      }),
    }),

    getLastSession: build.mutation({
      query: (query) => ({
        method: "POST",
        url: `chat/session?mode=latest`,
        data: query,
      }),
    }),

    createNewSession: build.mutation({
      query: (query) => ({
        method: "POST",
        url: "chat/session?mode=new",
        data: query,
      }),
    }),

    checkChatSession: build.mutation({
      query: (query) => ({
        method: "POST",
        url: "chat/session?mode=check",
        data: query,
      }),
    }),

    getFriendListBySession: build.mutation({
      query: (query) => ({
        method: "POST",
        url: "chat/friend_list",
        data: query,
      }),
    }),

    ChatSessionsById: build.query({
      query: (query) => ({
        method: "GET",
        url: `chat/history/user/${query.user_id}`,
      }),
    }),

    ChatHistoryBySession: build.mutation({
      query: (query) => ({
        method: "POST",
        url: `chat/history/session`,
        data: query,
      }),
    }),
    sendVote:build.mutation({
      query:(data) =>     ({
        method:'GET',
        url:`chat/message/vote/${data.id}?mode=${data.mode}`,
      })
    })
  }),
});

export const {
  useFriendsQuery,
  useAcceptInvitationQuery,
  useGetUserQuery,
  useSendMessageMutation,
  useFriendsMutation,
  useSendInvitationMutation,
  useGetLastSessionMutation,
  useCreateNewSessionMutation,
  useCheckChatSessionMutation,
  useGetFriendListBySessionMutation,
  useChatSessionsByIdQuery,
  useChatHistoryBySessionMutation,
  useSendVoteMutation
} = chatService;
