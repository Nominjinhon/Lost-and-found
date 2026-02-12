function sendErrorResponse(res, statusCode, message) {
  res.status(statusCode).json({ message });
}

function sendValidationError(res, message = "Бүх талбарыг бөглөнө үү") {
  sendErrorResponse(res, 400, message);
}

function sendUnauthorizedError(res, message = "Нэвтрэх эрх хүрэхгүй байна") {
  sendErrorResponse(res, 401, message);
}

function sendNotFoundError(res, message = "Олдсонгүй") {
  sendErrorResponse(res, 404, message);
}

function sendServerError(res, error) {
  console.error(error);
  sendErrorResponse(res, 500, error.message);
}

module.exports = {
  sendErrorResponse,
  sendValidationError,
  sendUnauthorizedError,
  sendNotFoundError,
  sendServerError,
};
