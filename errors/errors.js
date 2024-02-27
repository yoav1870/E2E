class ServerError extends Error {
  constructor() {
    super(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
    this.status = 500;
    this.name = "ServerError";
  }
}
class NotFoundUrlError extends Error {
  constructor() {
    super("Not Found");
    this.status = 404;
    this.name = "NotFoundUrlError";
  }
}
class NotFoundCRUD extends Error {
  constructor() {
    super("Not Found");
    this.status = 404;
    this.name = "NotFoundCRUD";
  }
}
class NotFoundErrorId extends Error {
  constructor(id) {
    super("plan with id: " + id + " not found");
    this.status = 404;
    this.name = "NotFoundError";
  }
}
class InvalidIdError extends Error {
  constructor(id) {
    super("Invalid id, received id: " + id + " .");
    this.status = 400;
    this.name = "InvalidIdError";
  }
}
class RequiredIdError extends Error {
  constructor(action) {
    super("required id to " + action + " the plan.");
    this.status = 404;
    this.name = "RequiredIdError";
  }
}
class PlanAlreadyExistsError extends Error {
  constructor(id) {
    super("Plan with id : " + id + " already exists");
    this.status = 409;
    this.name = "PlanExistsError";
  }
}
class PlanDoesNotExistError extends Error {
  constructor(id) {
    super("Plan with id: " + id + " does not exist");
    this.status = 404;
    this.name = "PlanDoesNotExistError";
  }
}
class NoDataError extends Error {
  constructor() {
    super("No data found");
    this.status = 404;
    this.name = "NoDataError";
  }
}
module.exports = {
  ServerError,
  NotFoundUrlError,
  NotFoundCRUD,
  NotFoundErrorId,
  InvalidIdError,
  RequiredIdError,
  PlanAlreadyExistsError,
  PlanDoesNotExistError,
  NoDataError,
};
