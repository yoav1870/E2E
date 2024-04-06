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

describe("GET /api/reports/:id", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_provider" };
      next();
    });
  });
  it("should return 500 for server errors", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app).get(`/api/reports/1`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 when no report found", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      return null;
    });

    const response = await request(app).get(`/api/reports/1`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at getReport with id 1 .");
  });
  it("should return 403 when report is not assigned to user", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      return { reportId: "1", assignedUser: "456" };
    });

    const response = await request(app).get(`/api/reports/1`);

    expect(response.status).toBe(403);
    expect(response.body).toEqual(
      "Access Denied you forbidden for this content."
    );
  });
  it("should return 200 and report", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      return { reportId: "1", assignedUser: "123" };
    });

    const response = await request(app).get(`/api/reports/1`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ reportId: "1", assignedUser: "123" });
  });
});

describe("POST /api/reports", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    const response = await request(app).post(`/api/reports`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 404 when no user found", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return null;
    });

    const response = await request(app).post(`/api/reports`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      "No data found at createReport with id 123 ."
    );
  });
  it("should return 400 if user of service_provider try to create a report", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_provider" };
    });

    const response = await request(app).post(`/api/reports`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "Only service request users can submit reports."
    );
  });
  it("should return 400 for form errors", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_request" };
    });
    reportRepository.create.mockImplementation(() => {
      throw new Error("Form error");
    });

    const response = await request(app).post(`/api/reports`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "Please provide all required fields at createReport"
    );
  });
  it("should return 400 for no service provider available", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_request" };
    });
    UserRepository.findNearbyAndByProfession.mockImplementation(() => {
      return [];
    });

    const response = await request(app).post(`/api/reports`).send({
      location: "location",
      profession: "profession",
      description: "description",
      urgency: "low",
      dateOfResolve: "24/12/2021",
      range: 10,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "No service provider available for this report. Please try again later."
    );
  });
});

describe("PUT /api/reports/updateDate/:id", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_request" };
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
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: "24/12/2024" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 400 when no new date provided", async () => {
    const response = await request(app).put(`/api/reports/updateDate/1`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "Please provide a new date and the report id"
    );
  });
  it("should return 400 when the new date is invalid", async () => {
    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2000-12-24") });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("The date must be in the future");
  });
  it("should return 404 when no user found with this token", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return null;
    });

    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2030-12-24") });

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      "No data found at updateDateOfResolve with id 123 ."
    );
  });
  it("should return 403 when a service provider user try to change the date", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "456", role: "service_provider" };
    });

    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2030-12-24") });

    expect(response.status).toBe(403);
    expect(response.body).toEqual(
      "Access Denied you forbidden for this content."
    );
  });
  it("should return 404 when no report found", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_request" };
    });
    reportRepository.retrieve.mockImplementation(() => {
      return null;
    });

    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2030-12-24") });

    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      "No data found at updateDateOfResolve with id 1 ."
    );
  });
  it("should return 400 when the new date is equal to the old date", async () => {
    UserRepository.retrieve.mockImplementation(() => {
      return { userId: "123", role: "service_request" };
    });
    reportRepository.retrieve.mockImplementation(() => {
      return { reportId: "1", dateOfResolve: new Date("2030-12-24") };
    });

    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2030-12-24") });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      "The new date must be different from the old date"
    );
  });

  it("should return 400 when failed crud", async () => {
    UserRepository.retrieve
      .mockImplementationOnce(() =>
        Promise.resolve({ userId: "123", role: "service_request" })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          userId: "456",
          role: "service_request",
          reports: ["1"],
        })
      );

    reportRepository.retrieve.mockImplementation((id) =>
      Promise.resolve({
        reportId: id,
        assignedUser: "456",
        dateOfResolve: new Date("2032-12-24"),
      })
    );

    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2030-12-24").toISOString() });

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Failed to update the report");
  });
  it("should return 200 when the date is updated", async () => {
    UserRepository.retrieve.mockResolvedValue({
      userId: "123",
      role: "service_request",
    });
    reportRepository.retrieve.mockResolvedValue({
      reportId: "1",
      assignedUser: "456",
      dateOfResolve: new Date("2025-12-24"),
    });
    UserRepository.retrieve.mockResolvedValue({
      userId: "456",
      role: "service_request",
      reports: ["1"],
    });
    reportRepository.retrieve.mockResolvedValue({
      reportId: "1",
      assignedUser: "456",
      dateOfResolve: new Date("2025-12-24"),
    });
    reportRepository.updateDateOfResolve.mockResolvedValue(true);
    const response = await request(app)
      .put(`/api/reports/updateDate/1`)
      .send({ newDateOfResolve: new Date("2030-12-24").toISOString() });

    expect(response.status).toBe(200);
    expect(response.body).toEqual("Report updated");
  });
});

describe("DELETE /api/reports", () => {
  beforeEach(() => {
    authenticateToken.mockImplementation((req, res, next) => {
      req.user = { userId: "123", role: "service_request" };
      next();
    });
  });
  it("should return 500 for server errors", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      const error = new Error("Unexpected error");
      error.name = "UnknownError";
      throw error;
    });

    const response = await request(app).delete(`/api/reports`).send({ id: 1 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual(
      "server encountered an unexpected condition that prevented it from fulfilling the request."
    );
  });
  it("should return 400 for no id provided", async () => {
    const response = await request(app).delete(`/api/reports`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual("Please provide the report id");
  });
  it("should return 404 when no report found with this id", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      return null;
    });
    const response = await request(app).delete(`/api/reports`).send({ id: 1 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual("No data found at deleteReport with id 1 .");
  });
  it("should return 403 when a service_request user try to delete report that he didnt submit", async () => {
    reportRepository.retrieve.mockImplementation(() => {
      return { reportId: "1", reportByUser: "456" };
    });
    const response = await request(app).delete(`/api/reports`).send({ id: 1 });

    expect(response.status).toBe(403);
    expect(response.body).toEqual(
      "Access Denied you forbidden for this content."
    );
  });
});
