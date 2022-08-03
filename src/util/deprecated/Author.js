import axiosInstance from './axiosConfig';
import { createCancelTokenHandler } from "./axiosUtils";

// cancelToken: sets a cancel token and cancels the previous request of this type
export const Author = {
    getAll: function() {
        return axiosInstance.request({
            method: "GET",
            url: `/api/v1/authors`,
            cancelToken: cancelTokenHandlerObject[this.getAll.name].handleRequestCancellation().token
        });
    },
    get: function(authorId) {
        return axiosInstance.request({
            method: "GET",
            url: `/api/v1/authors/${authorId}`,
            cancelToken: cancelTokenHandlerObject[this.getById.name].handleRequestCancellation().token
        });
    },
    getBooks: function(authorId) {
        return axiosInstance.request({
            method: "GET",
            url: `/api/v1/authors/${authorId}/books`,
            cancelToken: cancelTokenHandlerObject[this.getBooks.name].handleRequestCancellation().token
        });
    },
    update: function(authorId, author) {
        return axiosInstance.request({
            method: "PUT",
            url: `/api/v1/authors/${authorId}`,
            data: author,
            cancelToken: cancelTokenHandlerObject[this.update.name].handleRequestCancellation().token
        });
    },
}

// creating the cancel token handler object
const cancelTokenHandlerObject = createCancelTokenHandler(Author)