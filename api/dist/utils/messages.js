"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signupHtmlMessage = exports.htmlMessagerespondContact = exports.htmlMessagerespondAppointment = exports.htmlMessageWaitingList = exports.htmlMessageRejected = exports.htmlMessageOfapplicationytr = exports.htmlMessageOfapplication = exports.htmlMessageApprovegfdfgfd = void 0;
var company = "fablab rwanda";
var htmlMessageOfapplicationytr = exports.htmlMessageOfapplicationytr = "\n<html>\n  <head>\n    <style>\n      body {\n        font-family: 'Arial', sans-serif;\n        background-color: #f5f5f5;\n        color: #333;\n        margin: 20px;\n      }\n      h1 {\n        color: #4285f4;\n      }\n      p {\n        font-size: 16px;\n        line-height: 1.5;\n      }\n    </style>\n    <title>Application Successful</title>\n  </head>\n  <body>\n    <h1>Thank you for applying!</h1>\n    <p>Your application was successful. We will review the information you have provided, and you will receive a response soon!</p>\n  </body>\n</html>\n";
var htmlMessageApprovegfdfgfd = exports.htmlMessageApprovegfdfgfd = "\n<html>\n  <head>\n    <style>\n      body {\n        font-family: 'Arial', sans-serif;\n        background-color: #e6ffe6;\n        color: #006600;\n        margin: 20px;\n      }\n      h1 {\n        color: #006600;\n      }\n      p {\n        font-size: 16px;\n        line-height: 1.5;\n      }\n    </style>\n    <title>Application Approved</title>\n  </head>\n  <body>\n    <h1>Congratulations!</h1>\n    <p>Your application has been approved. Welcome to our community!</p>\n  </body>\n</html>\n";
var htmlMessageRejected = exports.htmlMessageRejected = function htmlMessageRejected(bodyMessage, gender, name) {
  // Make gender case-insensitive
  var lowerCaseGender = gender.toLowerCase();

  // Determine title based on gender
  var title = lowerCaseGender === 'male' ? 'Mr.' : lowerCaseGender === 'female' ? 'Ms.' : '';

  // Greet the applicant based on gender
  var greeting = title ? "Dear ".concat(title, " ").concat(name, ",") : "Dear ".concat(name, ",");

  // Construct the HTML message with styles
  var htmlMessage = "\n    <html>\n      <head>\n        <style>\n          body {\n            font-family: 'Arial', sans-serif;\n            background-color: #f4f4f4;\n            color: #333;\n            margin: 0;\n            padding: 20px;\n          }\n\n          p {\n            margin-bottom: 15px;\n          }\n\n          h1 {\n            color: #e74c3c;\n          }\n        </style>\n        <title>Application Rejected</title>\n      </head>\n      <body>\n        <h1>Application Rejected</h1>\n        <p>".concat(greeting, "</p>\n        <p>").concat(bodyMessage, "</p>\n        <p>We appreciate your interest in our program. If you have any questions, feel free to reach out.</p>\n        <p>Best regards,</p>\n        <p>").concat(company, "</p>\n      </body>\n    </html>\n  ");
  return htmlMessage;
};
var htmlMessageOfapplication = exports.htmlMessageOfapplication = "\n<html>\n  <head>\n    <style>\n      body {\n        font-family: 'Arial', sans-serif;\n        background-color: #f5f5f5;\n        color: #333;\n        margin: 20px;\n      }\n      h1 {\n        color: #4285f4;\n      }\n      p {\n        font-size: 16px;\n        line-height: 1.5;\n      }\n    </style>\n    <title>Application Successful</title>\n  </head>\n  <body>\n    <h1>Thank you for applying!</h1>\n    <p>Your application was successful. We will review the information you have provided, and you will receive a response soon!</p>\n  </body>\n</html>\n";
var htmlMessagerespondContact = exports.htmlMessagerespondContact = function htmlMessagerespondContact(subject, bodyMessage, name, company) {
  "Dear ".concat(name, ",");
  // Construct the HTML message with styles
  var htmlMessage = "\n    <html>\n      <head>\n        <style>\n          body {\n            font-family: 'Arial', sans-serif;\n            background-color: #f4f4f4;\n            color: #333;\n            margin: 0;\n            padding: 20px;\n          }\n\n          p {\n            margin-bottom: 15px;\n          }\n\n          h1 {\n            color: #009688;\n          }\n        </style>\n        <title>Your Application Status</title>\n      </head>\n      <body>\n        <h1>response from musa health care</h1>\n         <p>".concat(subject, "</p>\n        <p>").concat(bodyMessage, "</p>\n        <p>Best regards,</p>\n        <p>").concat(company, "</p>\n      </body>\n    </html>\n  ");
  return htmlMessage;
};
var signupHtmlMessage = exports.signupHtmlMessage = "\n<html>\n  <head>\n    <style>\n      body {\n        font-family: 'Arial', sans-serif;\n        background-color: #ffcccc;\n        color: #cc0000;\n        margin: 20px;\n      }\n      h1 {\n        color: #cc0000;\n      }\n      p {\n        font-size: 16px;\n        line-height: 1.5;\n      }\n    </style>\n    <title>signup goes well</title>\n  </head>\n  <body>\n    <h1> succeful registration on fab lab</h1>\n    <p>registaraton message.</p>\n  </body>\n</html>\n";
var htmlMessageWaitingList = exports.htmlMessageWaitingList = function htmlMessageWaitingList(bodyMessage, gender, name) {
  // Make gender case-insensitive
  var lowerCaseGender = gender.toLowerCase();

  // Determine title based on gender
  var title = lowerCaseGender === 'male' ? 'Mr.' : lowerCaseGender === 'female' ? 'Ms.' : '';

  // Greet the applicant based on gender
  var greeting = title ? "Dear ".concat(title, " ").concat(name, ",") : "Dear ".concat(name, ",");

  // Construct the HTML message with styles
  var htmlMessage = "\n    <html>\n      <head>\n        <style>\n          body {\n            font-family: 'Arial', sans-serif;\n            background-color: #f4f4f4;\n            color: #333;\n            margin: 0;\n            padding: 20px;\n          }\n\n          p {\n            margin-bottom: 15px;\n          }\n\n          h1 {\n            color: #3498db;\n          }\n        </style>\n        <title>Application on Waiting List</title>\n      </head>\n      <body>\n        <h1>Application on Waiting List</h1>\n        <p>".concat(greeting, "</p>\n        <p>").concat(bodyMessage, "</p>\n        <p>We will notify you as soon as a spot becomes available. Thank you for your patience.</p>\n        <p>Best regards,</p>\n        <p>").concat(company, "</p>\n      </body>\n    </html>\n  ");
  return htmlMessage;
};

// Function to generate HTML message for responding to contact
var htmlMessagerespondAppointment = exports.htmlMessagerespondAppointment = function htmlMessagerespondAppointment(subject, bodyMessage, name, company) {
  // Construct the HTML message with styles
  var htmlMessage = "\n    <html>\n      <head>\n        <style>\n          body {\n            font-family: 'Arial', sans-serif;\n            background-color: #f4f4f4;\n            color: #333;\n            margin: 0;\n            padding: 20px;\n          }\n\n          p {\n            margin-bottom: 15px;\n          }\n\n          h1 {\n            color: #009688;\n          }\n        </style>\n        <title>Your Application Status</title>\n      </head>\n      <body>\n        <h1>Response from Musa Health Care</h1>\n        <p>".concat(subject, "</p>\n        <p>").concat(bodyMessage, "</p>\n        <p>Best regards,</p>\n        <p>").concat(company, "</p>\n      </body>\n    </html>\n  ");
  return htmlMessage;
};

// Example usage within the context of responding to an appointment request