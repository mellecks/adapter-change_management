const request = require('request');

const validResponseRegex = /(2\d\d)/;


/**
 * The ServiceNowConnector class.
 *
 * @summary ServiceNow Change Request Connector
 * @description This class contains properties and methods to execute the
 *   ServiceNow Change Request product's APIs.
 */
class ServiceNowConnector {

  /**
   * @memberof ServiceNowConnector
   * @constructs
   * @description Copies the options parameter to a public property for use
   *   by class methods.
   *
   * @param {object} options - API instance options.
   * @param {string} options.url - Your ServiceNow Developer instance's URL.
   * @param {string} options.username - Username to your ServiceNow instance.
   * @param {string} options.password - Your ServiceNow user's password.
   * @param {string} options.serviceNowTable - The table target of the ServiceNow table API.
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @callback iapCallback
   * @description A [callback function]{@link
   *   https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
   *   is a function passed into another function as an argument, which is
   *   then invoked inside the outer function to complete some kind of
   *   routine or action.
   *
   * @param {*} responseData - When no errors are caught, return data as a
   *   single argument to callback function.
   * @param {error} [errorMessage] - If an error is caught, return error
   *   message in optional second argument to callback function.
   */

  /**
   * @memberof ServiceNowConnector
   * @method constructUri
   * @summary Calls ServiceNow constructUri API
   * @description Build and return the proper URI by appending an optionally passed
   *   [URL query string]{@link https://en.wikipedia.org/wiki/Query_string}.
   *
   * @param {string} serviceNowTable - The table target of the ServiceNow table API.
   * @param {string} [query] - Optional URL query string.
   *
   * @return {string} ServiceNow URL
   */
  constructUri(serviceNowTable, query = null) {
    let uri = `/api/now/table/${serviceNowTable}`;
    if (query) {
      uri = uri + '?' + query;
    }
    return uri;
  }
 
  /**
   * @memberof ServiceNowConnector
   * @method isHibernating
   * @summary Calls ServiceNow isHibernating API
   * @description Checks if request function responded with evidence of
   *   a hibernating ServiceNow instance.
   *
   * @param {object} response - The response argument passed by the request function in its callback.
   * @param {(object|string)} response.body - The body argument passed inside the object response by the request function in its callback.
   * @param {(object|string)} response.statusCode - The statCode argument passed inside the object response by the request function in its callback.
   *
   * @return {boolean} Returns true if instance is hibernating. Otherwise returns false.
   */
  isHibernating(response) {
    return response.body.includes('Instance Hibernating page')
    && response.body.includes('<html>')
    && response.statusCode === 200;
  }
 
  /**
   * @memberof ServiceNowConnector
   * @method processRequestResults
   * @summary Calls ServiceNow processRequestResults API
   * @description Inspect ServiceNow API response for an error, bad response code, or
   *   a hibernating instance. If any of those conditions are detected, return an error.
   *   Else return the API's response.
   *
   * @param {error} error - The error argument passed by the request function in its callback.
   * @param {object} response - The response argument passed by the request function in its callback.
   * @param {string} body - The HTML body argument passed by the request function in its callback.
   * @param {(object|string)} response.body - The body argument passed inside the object response by the request function in its callback.
   * @param {(object|string)} response.statusCode - The statCode argument passed inside the object response by the request function in its callback.
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   * @param {(object|string)} callbackData argument passed by the request function in its callback after verifying there is no error.
   * @param {sting} callbackError error argument passed by the request function in its callback or a ibernating session message.
   */
  processRequestResults(error, response, body, callback) {
  /**
   * You must build the contents of this function.
   * Study your package and note which parts of the get()
   * and post() functions evaluate and respond to data
   * and/or errors the request() function returns.
   * This function must not check for a hibernating instance;
   * it must call function isHibernating.
   */
    let callbackError = null;
    let callbackData = null;
    if (this.isHibernating(response)){
      callbackError = 'Service Now instance is hibernating';
      console.error(callbackError);
    } else if (error) {
      console.error('Error present.');
      callbackError = error;
    } else if (response.body.includes('Instance Hibernating page')) {
      callbackError = 'Service Now instance is hibernating';
      console.error(callbackError);
    } else {
      callbackData = response;
    } 
    return callback(callbackData, callbackError); 
  } 
 
  /**
   * @memberof ServiceNowConnector
   * @method sendRequest
   * @summary Calls ServiceNow sendRequest API
   * @description Builds final options argument for request function
   *   from global const options and parameter callOptions.
   *   Executes request call, then verifies response.
   *
   * @param {object} callOptions - Passed call options.
   * @param {string} callOptions.query - URL query string.
   * @param {string} callOptions.serviceNowTable - The table target of the ServiceNow table API.
   * @param {string} callOptions.method - HTTP API request method.
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */
  sendRequest(callOptions, callback) {
  // Initialize return arguments for callback
    let uri;
    if (callOptions.query)
      uri = this.constructUri(callOptions.serviceNowTable, callOptions.query);
    else
      uri = this.constructUri(callOptions.serviceNowTable);
    const requestOptions = {
      method: callOptions.method,
      auth: {
        user: this.options.username,
        pass: this.options.password,
      },
      baseUrl: this.options.url,
      uri: uri,
    };
    request(requestOptions, (error, response, body) => {
      this.processRequestResults(error, response, body, (processedResults, processedError) => callback(processedResults, processedError));
    });
  }     

  /**
   * @memberof ServiceNowConnector
   * @method post
   * @summary Calls ServiceNow POST API
   * @description Call the ServiceNow POST API. Sets the API call's method,
   *   then calls sendRequest().
   *
   * @param {object} callOptions - Passed call options.
   * @param {string} callOptions.serviceNowTable - The table target of the ServiceNow table API.
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */
  post(callback) {
    let getCallOptions = { ...this.options };
    getCallOptions.method = 'POST';
    this.sendRequest(getCallOptions, (results, error) => callback(results, error));
  }
  
  /**
   * @memberof ServiceNowConnector
   * @method get
   * @summary Calls ServiceNow GET API
   * @description Call the ServiceNow GET API. Sets the API call's method and query,
   *   then calls this.sendRequest(). In a production environment, this method
   *   should have a parameter for passing limit, sort, and filter options.
   *   We are ignoring that for this course and hardcoding a limit of one.
   *
   * @param {iapCallback} callback - Callback a function.
   * @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
   *   Will be HTML text if hibernating instance.
   * @param {error} callback.error - The error property of callback.
   */ 
  get(callback) {
    let getCallOptions = { ...this.options };
    getCallOptions.method = 'GET';
    getCallOptions.query = 'sysparm_limit=1';
    this.sendRequest(getCallOptions, (results, error) => callback(results, error));
  }
}

module.exports = ServiceNowConnector;