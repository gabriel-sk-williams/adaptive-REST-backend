import axios from "axios";

const CancelToken = axios.CancelToken;

export function createCancelTokenHandler(apiObject) {
    // initializing the cancel token handler object
    const cancelTokenHandler = {};

    // for each property in apiObject, i.e. for each request
    Object
        .getOwnPropertyNames(apiObject)
        .forEach(propertyName => {
            // initializing the cancel token of the request
            const cancelTokenRequestHandler = {
                cancelToken: undefined
            }

            // associating the cancel token handler to the request name
            cancelTokenHandler[propertyName] = {
                handleRequestCancellation: () => {
                    // if a previous cancel token exists,
                    // cancel the request
                    cancelTokenRequestHandler.cancelToken && cancelTokenRequestHandler.cancelToken.cancel(`${propertyName} canceled`)

                    // creating a new cancel token
                    cancelTokenRequestHandler.cancelToken = CancelToken.source();

                    // returning the new cancel token
                    return cancelTokenRequestHandler.cancelToken;
                }
            }
        })

    return cancelTokenHandler;
}