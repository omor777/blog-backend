const error = (msg = "Something Went Wrong", status = 500) => {
  const e = new Error();
  e.message = msg;
  e.status = status;
  return e;
};

export default error;
