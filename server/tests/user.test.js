const app = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserRepository } = require("../repositories/user.repository");
const authenticateToken = require("../middlewares/authenticateToken");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../repositories/user.repository");
jest.mock("../repositories/report.repository");

jest.mock("../middlewares/authenticateToken", () =>
  jest.fn().mockImplementation((req, res, next) => {
    next();
  })
);

describe("GET /api/users/sign-in", () => {
  it("should return 500 for server errors", async () => {
    const mockUser = {
      _id: "user123",
      email: "y@gmail.com",
      password: "$2b$10$examplehashedpassword",
      role: "service_provider",
    };
    UserRepository.findByEmail.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });
    const response = await request(app).post("/api/users/sign-in").send({
      email: mockUser.email,
      password: "12345678",
    });
    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 400 for missing email or password", async () => {
    const response = await request(app).post("/api/users/sign-in").send({});
    expect(response.status).toBe(400);
    expect(response.body).toBe(
      "Please provide all required fields at signInUser"
    );
  });
  it("should return 400 for invalid email", async () => {
    const plaintextPassword = "12345678";
    const plaintextEmail = "z@gmail.com";

    UserRepository.findByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/users/sign-in")
      .send({ email: plaintextEmail, password: plaintextPassword });

    expect(response.status).toBe(400);
    expect(response.body).toBe("Invalid email or password.");
  });
  it("should return 400 for invalid bcrypt compare password", async () => {
    const mockUser = {
      _id: "user123",
      email: "y@gmail.com",
      password: "$2b$10$examplehashedpassword",
      role: "service_provider",
    };

    const plaintextPassword = "12345678";
    const plaintextEmail = "y@gmail.com";

    UserRepository.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/users/sign-in")
      .send({ email: plaintextEmail, password: plaintextPassword });

    expect(response.status).toBe(400);
    expect(response.body).toBe("Invalid email or password.");
  });
  it("should return a token with status 200 for valid credentials", async () => {
    const mockUser = {
      _id: "user123",
      email: "y@gmail.com",
      password: "$2b$10$examplehashedpassword",
      role: "service_provider",
    };

    const plaintextPassword = "12345678";
    const plaintextEmail = "y@gmail.com";
    const mockToken = "token";

    // Mock the return value of findByEmail to return the mockUser object
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    // Mock the return value of compare to return true
    bcrypt.compare.mockResolvedValue(true);
    // Mock the return value of sign to return the mockToken
    jwt.sign.mockReturnValue(mockToken);

    const response = await request(app)
      .post("/api/users/sign-in")
      .send({ email: plaintextEmail, password: plaintextPassword });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe(mockToken);
  });
});

describe("POST /api/users/sign-up", () => {
  it("should return 500 for server errors", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      role: "service_provider",
      location: "test location",
      profession: "test profession",
    };
    UserRepository.findByEmail.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app)
      .post("/api/users/sign-up")
      .send(userData);

    // expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });

  it("should return 400 for missing required fields", async () => {
    const response = await request(app).post("/api/users/sign-up").send({});
    expect(response.status).toBe(400);
    expect(response.body).toBe(
      "Please provide all required fields at createUser"
    );
  });
  it("should return 400 for invalid role", async () => {
    const mockUser = {
      email: "y@gmail.com",
      password: "12345678",
      username: "y",
      location: "y",
      role: "invalid_role",
    };
    const response = await request(app)
      .post("/api/users/sign-up")
      .send(mockUser);
    expect(response.status).toBe(400);
    expect(response.body).toBe("Invalid role: invalid_role");
  });
  it("should return 400 for missing profession field", async () => {
    const mockUser = {
      email: "y@gmail.com",
      password: "12345678",
      username: "y",
      location: "y",
      role: "service_provider",
    };
    const response = await request(app)
      .post("/api/users/sign-up")
      .send(mockUser);
    expect(response.status).toBe(400);
    expect(response.body).toBe("Please provide profession field at createUser");
  });
  it("should return 400 for user already exists", async () => {
    const mockUser = {
      email: "y@gmail.com",
      password: "12345678",
      username: "y",
      location: "y",
      role: "service_provider",
      profession: "y",
    };
    UserRepository.findByEmail.mockResolvedValue(mockUser);
    const response = await request(app)
      .post("/api/users/sign-up")
      .send(mockUser);
    expect(response.status).toBe(400);
    expect(response.body).toBe("User with this email already exists.");
  });
  it("should return 400 for failed to create a user", async () => {
    const mockUser = {
      email: "y@gmail.com",
      password: "12345678",
      username: "y",
      location: "y",
      role: "service_provider",
      profession: "y",
    };
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.create.mockResolvedValue(null);
    const response = await request(app)
      .post("/api/users/sign-up")
      .send(mockUser);
    expect(response.status).toBe(400);
    expect(response.body).toBe("Failed to create a user");
  });
  it("should return 201 for valid service provider", async () => {
    const mockUser = {
      email: "y@gmail.com",
      password: "12345678",
      username: "y",
      location: "y",
      role: "service_provider",
      profession: "y",
    };
    UserRepository.findByEmail.mockResolvedValue(null);
    UserRepository.create.mockResolvedValue(mockUser);
    const response = await request(app)
      .post("/api/users/sign-up")
      .send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(mockUser);
  });
});

describe("GET /api/users/home", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_provider" };
      next();
    });
  });
  it("should return 500 for server errors", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app).get(`/api/users/home`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 if user does not exist", async () => {
    UserRepository.retrieve.mockResolvedValue(null);

    const response = await request(app).get(`/api/users/home`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at getUser with id 123 .");
  });
  it("should return 200 and user data if user exists", async () => {
    const mockData = { userId: "123", name: "John Doe" };
    UserRepository.retrieve.mockResolvedValue(mockData);

    const response = await request(app).get(`/api/users/home`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });
});

describe("GET /api/users/:id", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_provider" };
      next();
    });
  });
  it("should return 500 for server errors", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app).get(`/api/users/123`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 if user does not exist", async () => {
    UserRepository.retrieve.mockResolvedValue(null);

    const response = await request(app).get(`/api/users/123`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at getUser with id 123 .");
  });
  it("should return 200 and user data if user exists", async () => {
    const mockData = { userId: "123", name: "John Doe" };
    UserRepository.retrieve.mockResolvedValue(mockData);

    const response = await request(app).get(`/api/users/123`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });
});

describe("PUT /api/users/updatePassword", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_provider" };
      next();
    });
  });
  it("should return 500 for server errors", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app)
      .put(`/api/users/updatePassword`)
      .send({ oldPassword: "old", newPassword: "new" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 400 for missing old password or new password", async () => {
    const response = await request(app)
      .put(`/api/users/updatePassword`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "Please provide all required fields at updateUserPassword"
    );
  });
  it("should return 400 if old password does not match", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
    });
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .put(`/api/users/updatePassword`)
      .send({ oldPassword: "old", newPassword: "new" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Old password does not match.");
  });
  it("should return 400 if the new password is the same as the old password", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
    });
    bcrypt.compare.mockResolvedValue(true);

    const response = await request(app)
      .put(`/api/users/updatePassword`)
      .send({ oldPassword: "old", newPassword: "old" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "New password must be different from the old one."
    );
  });
  it("should return 400 if failed to update password", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
    });
    bcrypt.compare.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    UserRepository.updatePassword.mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/users/updatePassword`)
      .send({ oldPassword: "old", newPassword: "new" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Failed to update a user");
  });
  it("should return 200 if password is updated successfully", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
    });
    bcrypt.compare.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    UserRepository.updatePassword.mockResolvedValue(true);

    const response = await request(app)
      .put(`/api/users/updatePassword`)
      .send({ oldPassword: "old", newPassword: "new" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual("Password has been updated");
  });
});

describe("DELETE /api/users/deleteUser", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_provider" };
      next();
    });
  });
  it("should return 500 for server errors", async () => {
    UserRepository.delete.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app).delete(`/api/users/deleteUser`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 if the user is not found", async () => {
    UserRepository.retrieve.mockResolvedValue(false);

    const response = await request(app).delete(`/api/users/deleteUser`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at deleteUser with id 123 .");
  });
  it("should return 400 if failed to delete the user with no reports", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
      reports: [],
    });

    UserRepository.delete.mockResolvedValue(null);

    const response = await request(app).delete(`/api/users/deleteUser`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Failed to delete a user");
  });

  it("should return 200 and delete the user when there are no reports associated", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
      reports: [],
    });

    UserRepository.delete.mockResolvedValue(true);

    const response = await request(app).delete(`/api/users/deleteUser`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual("User has been deleted");
  });
});
