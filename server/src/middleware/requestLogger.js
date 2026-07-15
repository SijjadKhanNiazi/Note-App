const pinoHttp = require("pino-http");
const logger = require("../utils/logger");

const requestLogger = pinoHttp({
  logger,

  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        ip: req.ip,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },

  customSuccessMessage: function (req, res, responseTime) {
    return `${req.method} ${req.url} completed with status ${res.statusCode} in ${responseTime}ms`;
  },
  customErrorMessage: function (req, res, error) {
    return `${req.method} ${req.url} failed with status ${res.statusCode}: ${error.message}`;
  },
});

module.exports = requestLogger;
