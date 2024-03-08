import { apiService } from "../instance/axiosBaseQuery";

export const authService = apiService
  .enhanceEndpoints({ addTagTypes: ["Auth", "Me"] })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
      me: build.query({
        query: () => ({ method: "GET", url: "auth/me" }),

      }),
      getUser: build.query({
        query: (id) => ({ method: "GET", url: `user/${id}` }),
      }),

      registration: build.mutation({
        query: (data) => ({
          method: "POST",
          url: "auth/signup",
          data,
        }),
      }),

      login: build.mutation({
        query: (data) => ({
          method: "POST",
          url: "auth/signin",
          data,
        }),
      }),
      recoveryPassword: build.mutation({
        query: (data) => ({
          method: "POST",
          url: "auth/password_reset_request",
          data,
        }),
      }),
      registrationConfirmation: build.mutation({
        query: (data) => ({
          method: "POST",
          url: "user/send_confirmation",
          data: data,
        }),
      }),
      sendCode: build.mutation({
        query: (data) => ({
          method: "POST",
          url: "user/email_confirm",
          data: data,
        }),
      }),
      logout: build.query({
        query: () => ({
          method: "GET",
          url: "auth/logout",
        }),
      }),
      newPassword: build.mutation({
        query: (data) => ({
          method: "POST",
          url: "auth/reset_password",
          data,
        }),
      }),
      deleteUser:build.mutation({
        query: (id) => ({
          method: 'DELETE',
          url:`user/${id}`,
        }),
      }),
    }),
  });

export const {
  useMeQuery,
  useGetUserQuery,
  useLogoutQuery,
  useRegistrationMutation,
  useLoginMutation,
  useRecoveryPasswordMutation,
  useNewPasswordMutation,
  useRegistrationConfirmationMutation,
  useSendCodeMutation,
  useDeleteUserMutation
} = authService;
