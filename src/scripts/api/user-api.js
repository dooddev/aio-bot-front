import { apiService } from "../instance/axiosBaseQuery";

export const userService = apiService.injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
        changeUser: build.mutation({
            query: (data) => {
                console.log('Data before request:', data.data);

                return {
                    method: 'PATCH',
                    url: `user/${data.id}`,
                    data: data.data,
                };
            },
        }),
        changeAvatar: build.mutation({
            query: (data) => {
                console.log('Data before request:', data.data);

                return {
                    method: 'POST',
                    url: `user/${data.id}/upload_avatar`,
                    data: data.data,
                };
            },
        }),
    }),
});

export const {
    useChangeUserMutation,
    useChangeAvatarMutation
} = userService;
