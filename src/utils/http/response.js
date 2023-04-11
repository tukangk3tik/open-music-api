const httpStatusCode = require('./status_code');
const ClientError = require('../../exceptions/ClientError');

const successResp = (
    data,
) => ({
  status: 'success',
  data: data,
});

const successRespMsg = (
    data,
    message,
) => {
  const obj = {
    status: 'success',
    message: message,
  };

  if (data) {
    obj.data = data;
  }

  return obj;
};

const failResp = (
    status,
    message,
) => ({
  status: status,
  message: message,
});

// for fail handler
const failHandler = (h, e) => {
  if (e instanceof ClientError) {
    const response = h.response(failResp('fail', e.message));
    response.code(e.statusCode);
    return response;
  }

  // handling server error
  const msg = 'Maaf, terjadi kegagalan pada server';
  const response = h.response(failResp('error', msg));
  response.code(httpStatusCode.serverError);
  console.error(e);
  return response;
};

module.exports = {
  successResp,
  successRespMsg,
  failResp,
  httpStatusCode,
  failHandler,
};
