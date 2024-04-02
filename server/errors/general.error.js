class NotFoundUrlError extends Error {
  constructor() {
    super("Not Found");
    this.status = 404;
    this.name = "NotFoundUrlError";
  }
}
class RequiredIdError extends Error {
  constructor(action, entity) {
    super("required id to " + action + " the " + entity + ".");
    this.status = 404;
    this.name = "RequiredIdError";
  }
}
class NotFoundCRUD extends Error {
  constructor() {
    super("Not Found");
    this.status = 404;
    this.name = "NotFoundCRUD";
  }
}
class NoDataError extends Error {
  constructor(msg) {
    super("No data found at " + msg + " .");
    this.status = 404;
    this.name = "NoDataError";
  }
}
class DataNotExistsError extends Error {
  constructor(msg, id) {
    super("No data found at " + msg + " with id " + id + " .");
    this.status = 404;
    this.name = "DataNotExistsError";
  }
}
class FormError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 400;
    this.name = "FormError";
  }
}
class DataAlreadyExistsError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 400;
    this.name = "DataAlreadyExistsError";
  }
}
class FailedCRUD extends Error {
  constructor(msg) {
    super(msg);
    this.status = 400;
    this.name = "FailedCRUD";
  }
}
class NoProviderAvailableError extends Error {
  constructor(msg) {
    super(msg);
    this.status = 400;
    this.name = "NoProviderAvailableError";
  }
}
class ServerError extends Error {
  constructor() {
    super(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
    this.status = 500;
    this.name = "ServerError";
  }
}

class SignInError extends Error {
  constructor() {
    super("Invalid email or password.");
    this.status = 400;
    this.name = "SignInError";
  }
}
module.exports = {
  NotFoundUrlError,
  RequiredIdError,
  NotFoundCRUD,
  NoDataError,
  DataNotExistsError,
  FormError,
  DataAlreadyExistsError,
  FailedCRUD,
  NoProviderAvailableError,
  ServerError,
  SignInError,
};
