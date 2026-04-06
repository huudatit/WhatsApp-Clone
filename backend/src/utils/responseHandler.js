export default response = (res, statusCode, message, data = null) => {
  if (!res) {
    console.error("Kết quả trả về bị rỗng");
    return;
  }

  const responseObject = {
    status: statusCode < 400 ? 'success' : 'error',
    message,
    data
  }

  return res.status(statusCode).json(responseObject);
}