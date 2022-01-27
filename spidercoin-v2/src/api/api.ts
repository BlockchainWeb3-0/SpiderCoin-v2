import axios, { AxiosResponse } from "axios";
import { WithDrawPostType } from "../models/post.interface";

const instance = axios.create({
    baseURL: "http://localhost:3001/blocks/addblocks",
    timeout: 15000,
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => instance.get(url).then(responseBody),
    post: (url: string, body: {}) =>
        instance.post(url, body).then(responseBody),
    put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
    delete: (url: string) => instance.delete(url).then(responseBody),
};

export const Post = {
    getPosts: (): Promise<WithDrawPostType[]> => requests.get("posts"),
    getAPost: (id: number): Promise<WithDrawPostType> =>
        requests.get(`posts/${id}`),
    createPost: (post: WithDrawPostType): Promise<WithDrawPostType> =>
        requests.post("posts", post),
    updatePost: (
        post: WithDrawPostType,
        id: number
    ): Promise<WithDrawPostType> => requests.put(`posts/${id}`, post),
    deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
};
