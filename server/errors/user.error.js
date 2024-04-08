class InvalidRoleError extends Error {
  constructor(role) {
    super("Invalid role: " + role);
    this.name = "InvalidRoleError";
    this.status = 400;
  }
}
module.exports = {
  InvalidRoleError,
};
