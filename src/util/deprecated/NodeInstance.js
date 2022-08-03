//import axiosInstance from './axiosConfig';

import axiosInstance from "axios";
import { createCancelTokenHandler } from "./axiosUtils";

// cancelToken: sets a cancel token and cancels the previous request of this type
export const NodeInstance = {
    getTest: function(hex)  {
        return axiosInstance.request({
            method: "GET",
            url: `http://localhost:3000/api/v0/node/${hex}`,
        })
    },
    getNode: function(hex) {
        return axiosInstance.request({
            method: "GET",
            url: `http://localhost:3000/api/v0/node/${hex}`,
            cancelToken: 
                cancelTokenHandlerObject[this.getNode.name].handleRequestCancellation().token
        });
    }
}

// create cancel token handler object
const cancelTokenHandlerObject = createCancelTokenHandler(NodeInstance);

/*
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
*/