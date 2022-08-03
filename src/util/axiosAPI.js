import axios from "axios";

export class requestHandler {
    constructor() {
      // this.cancel_request = null;
      this.base = "http://localhost:3000/";
      this.source = axios.CancelToken.source();
    }

    resetCancelToken = () => {
      if (this.source) this.source.cancel();
      this.source = axios.CancelToken.source();
    }

    getNode = (hex) => {
      let url = this.base + "node/" + hex;
      return axios.get(url, {
        cancelToken: this.source.token
        })
        .then(response => {
          let recs = response.data.records;
          if (recs.length) {
            let labels = recs[0]["_fields"][0].labels
            let props = recs[0]["_fields"][0].properties;
            props.layer = labels;
            return props;
          }
        })
        .catch((error) => { // watch for the cancel then report
          if (axios.isCancel(error)) return false;
        });
    }

    getSearch = (type, query) => {
      let url = this.base + type + "/" + query;
      return axios.get(url, {
        cancelToken: this.source.token
        })
        .then(response => {
          let recs = response.data.records;
          if (recs.length) {
            console.log(recs);
          }
        })
    }
}


/*
searchNodes = async (url) => {
  this.requestHandler.cancelAndCreateToken();
  try {
    const response = await axios.get(url, { 
      cancelToken: this.requestHandler.cancel_request.token 
    })
    this.requestHandler.resetCancelToken();
    return response; // response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message);
    }else{
      // do nothing I guess
    }
  }
}

// testAPI(url).then((props) => { this.setState({ hovered: props }); });
export const testAPI = (url) => {
    return axios.get(url, {
        cancelToken: source.token
        })
        .then(response => {
          let recs = response.data.records;
          if (recs.length) {
            let labels = recs[0]["_fields"][0].labels
            let props = recs[0]["_fields"][0].properties;
            props.layer = labels;
            return props;
            // this.setState({ hovered: props })
          }
        })
        .catch((error) => {
            // watch for the cancel and then report on the call
            if (axios.isCancel(error)) {
                console.log("cancelcanlca")
              return 'HTTP call ended with cancel';
            }
        });
}

export const cancel = () => {
    if (source) source.cancel("yas");
}

// source.cancel();

export const callCancel = () => {
    return function (dispatch) {
      if (source.cancel !== undefined) {
        source.cancel("jaboy cancelled haha");
      }
  
      return;
    };
}

// if (this.cancel) this.cancel.cancel();
// this.cancel = axios.CancelToken.source(); // Get a new token

export const NodeInstance = {
    getTest: function(hex)  {
        return axiosInstance.request({
            method: "GET",
            url: `http://localhost:3000/api/v0/node/${hex}`,
        })
    }
}
    



/*
function retrieveMessage() {

    axios
      .get("http://localhost:5000/api/call", {
        cancelToken: new CancelToken((c) => {
          cancel = c;
        }),
      })
      .then((response) => {
        // this would be a successful return from the call
    return response.data;
      })
      .catch((error) => {
        // watch for the cancel and then report on the call
        if (axios.isCancel(error)) {
          return 'HTTP call ended with cancel';
        }

    // when an error happened that was not the cancel token
        return JSON.stringify(error);
      });

    return;
  };
}

function callCancel() {
  return function (dispatch) {
    if (cancel !== undefined) {
      cancel();
    }

    return;
  };
}
*/