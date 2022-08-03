
// creates cancel token using the CancelToken.source factory
import axios from "axios";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();
const token = source.token; // retrieve cancel token

axios.post('/user/12345', {
  name: 'a name'
}, {
  cancelToken: token   // associate request with cancel token
})

source.cancel( 'Request canceled!' ); // cancel request