function formValidation(object) {
  const { username, email, password, passwordConfirm } = object;

  let NoErrorObject = {
    status: true,
    message: "",
  };

  // Return false in case there is an empty field
  Object.values(object).forEach((value) => {
    if (value === undefined || value === "") {
      NoErrorObject = {
        status: false,
        message: "All fields must be filled",
        field: "all",
      };

      return NoErrorObject;
    }
  });

  if (NoErrorObject.status === false) {
    return NoErrorObject;
  }

  // -------- Checking Required Fields -----------
  if (username.length <= 4 || Object.values(username).includes(" ")) {
    NoErrorObject = {
      status: false,
      message:
        "Username can not have less than 5 characters nor have any whitespace",
      field: "username",
    };

    return NoErrorObject;
  }

  if (password.length <= 7) {
    NoErrorObject = {
      status: false,
      message: "Password must be at least 8 characters long",
      field: "password",
    };
    return NoErrorObject;
  }

  if (passwordConfirm) {
    if (password !== passwordConfirm) {
      return {
        status: false,
        message: "Password and confirmed password does not match",
        field: "password",
      };
    }
  }

  if (email) {
    // eslint-disable-next-line
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      NoErrorObject = {
        status: false,
        message: "Not a valid email",
        field: "email",
      };
      return NoErrorObject;
    }
  }

  return NoErrorObject;
}

module.exports = formValidation;
