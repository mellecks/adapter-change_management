// Update this constant with your ServiceNow credentials
const options = {
  url: 'https://dev114521.service-now.com/',
  username: 'admin',
  password: 'Hercul3$',
  serviceNowTable: 'change_request',
};


/**
 * Import the Node.js request package.
 * See https://www.npmjs.com/package/request
 */
const request = require('request');


// We'll use this regular expression to verify REST API's HTTP response status code.
const validResponseRegex = /(2\d\d)/;

// Update this section with your ServiceNow credentials
const calloptions = {
  url: 'https://dev114521.service-now.com/',
  username: 'admin',
  password: 'Hercul3$',
  serviceNowTable: 'change_request',
};


// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js.
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

/**
 * @function mainOnObject
 * @description Instantiates an object from the imported ServiceNowConnector class
 *   and tests the object's get and post methods.
 */
 
function mainOnObject(calloptions) {
  // Instantiate an object from class ServiceNowConnector.
  const connector = new ServiceNowConnector(options);
  // Test the object's get and post methods.
  // You must write the arguments for get and post.
 
  let callBackdata;
  let callBackerror;
  connector.get(calloptions,(callBackdata, callBackerror));
  console.log(`Callbackdata ${callBackerror}`);
  connector.post(calloptions,(callBackdata, callBackerror));
}

// Call mainOnObject to run it.
mainOnObject();