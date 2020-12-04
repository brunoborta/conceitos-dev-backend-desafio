const { validate: isUuid } = require("uuid");

function verifyId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repository ID" });
  }

  return next();
}

module.exports = { verifyId };
