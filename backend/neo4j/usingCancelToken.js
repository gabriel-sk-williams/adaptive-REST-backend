import axios from "axios";

// creating a cancel token using the CancelToken.source factory
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// retrieving the cancel token
const token = source.token;

axios.post('/user/12345', {
  name: 'a name'
}, {
  // associating the request to the cancel token
  cancelToken: source.token
})

// canceling the request
source.cancel(
  'Request canceled!' // optional
);