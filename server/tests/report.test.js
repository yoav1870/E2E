const app = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middlewares/authenticateToken");
const { UserRepository } = require("../repositories/user.repository");
const { reportRepository } = require("../repositories/report.repository");
jest.mock("jsonwebtoken");
jest.mock("../repositories/user.repository");
jest.mock("../repositories/report.repository");
jest.mock("../middlewares/authenticateToken", () =>
  jest.fn().mockImplementation((req, res, next) => {
    next();
  })
);

describe("GET /api/reports/home", () => {
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

    const response = await request(app).get(`/api/reports/home`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 for not found user", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return null;
    });

    const response = await request(app).get(`/api/reports/home`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      "No data found at getAllReportsOfUser with id 123 ."
    );
  });
  it("should return 404 when no reports found", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_provider" };
    });
    reportRepository.findReportsOfUser.mockImplementation(() => {
      return [];
    });

    const response = await request(app).get(`/api/reports/home`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at getAllReportsOfUser .");
  });
  it("should return 200 and reports", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_provider" };
    });
    reportRepository.findReportsOfUser.mockImplementation(() => {
      return [{ reportId: "1" }];
    });

    const response = await request(app).get(`/api/reports/home`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ reportId: "1" }]);
  });
});

describe("GET /api/reports/past", () => {
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

    const response = await request(app).get(`/api/reports/past`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 for not found user", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return null;
    });

    const response = await request(app).get(`/api/reports/past`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      "No data found at getOldReportsOfUser with id 123 ."
    );
  });
  it("should return 404 when no reports found", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_provider" };
    });
    reportRepository.findReportsOfUser.mockImplementation(() => {
      return [];
    });

    const response = await request(app).get(`/api/reports/past`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at getOldReportsOfUser .");
  });
  it("should return 200 and reports", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_provider" };
    });
    reportRepository.findReportsOfUser.mockImplementation(() => {
      return [{ reportId: "1" }];
    });

    const response = await request(app).get(`/api/reports/past`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ reportId: "1" }]);
  });
});
