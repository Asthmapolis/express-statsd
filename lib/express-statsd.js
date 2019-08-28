"use strict";

var assert = require("assert");
var extend = require("obj-extend");
var Lynx = require("lynx");

module.exports = function expressStatsdInit(options) {
  // Function called on response finish that sends stats to statsd
  function sendStats(req, res, client, totalTime, options) {
    var key = req[options.requestKey];
    key = key ? key + "." : "";

    // Status Code
    var statusCode = res.statusCode || "unknown_status";
    client.increment(key + "status_code." + statusCode);

    // Response Time
    client.timing(key + "response_time", totalTime);
  }

  options = extend(
    {
      requestKey: "statsdKey",
      host: "127.0.0.1",
      port: 8125,
      sendStats: sendStats
    },
    options
  );

  assert(options.requestKey, "express-statsd expects a requestKey");

  var client = options.client || new Lynx(options.host, options.port, options);

  return function expressStatsd(req, res, next) {
    var startTime = process.hrtime();

    function send() {
      // hrtime is an array of seconds + nanoseconds
      // compute a more useful millisecond value for the caller
      var hrTime = process.hrtime(startTime);
      var totalTime = hrTime[0] * 1e3 + hrTime[1] / 1e6;

      options.sendStats(req, res, client, totalTime, options);
      cleanup();
    }

    // Function to clean up the listeners we've added
    function cleanup() {
      res.removeListener("finish", send);
      res.removeListener("error", cleanup);
      res.removeListener("close", cleanup);
    }

    // Add response listeners
    res.once("finish", send);
    res.once("error", cleanup);
    res.once("close", cleanup);

    if (next) {
      next();
    }
  };
};
