import axios from "axios";

const CancelToken = axios.CancelToken;

export function createCancelTokenHandler(apiObject) { // each property in apiObject is a request
    
    const cancelTokenHandler = {}; // initialize handler

    Object
        .getOwnPropertyNames(apiObject)
        .forEach(propertyName => {
            
            const cancelTokenRequestHandler = { cancelToken: undefined } // initialize cancel token

            // associating the cancel token handler to the request name
            cancelTokenHandler[propertyName] = {
                handleRequestCancellation: () => {

                    // if a previous cancel token exists, cancel request
                    cancelTokenRequestHandler.cancelToken && 
                    cancelTokenRequestHandler.cancelToken.cancel(`${propertyName} canceled`)

                    // create new token and return 
                    cancelTokenRequestHandler.cancelToken = CancelToken.source();
                    return cancelTokenRequestHandler.cancelToken;
                }
            }
        })

    return cancelTokenHandler;
}