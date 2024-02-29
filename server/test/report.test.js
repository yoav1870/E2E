const app = require("../server");
const { ServerError } = require("../errors/errors");
const { reportRepository } = require("../repository/report.repository");
const request = require("supertest");
jest.mock("../repository/report.repository");

describe("GET /api/report", () => {
  it("should return 200 and all reports", async () => {
    const mockReports = [
      {
        id: "1",
        location: "Building A, Room 101",
        description: "Cracked wall",
        severity: "high",
        status: 50,
        timestamp: "2024-02-27T10:30:00",
        submittedBy: "John Doe",
        assignedTo: "Maintenance Team A",
        comments: [
          {
            author: "Maintenance Team A",
            text: "Scheduled repair for tomorrow.",
          },
          {
            author: "John Doe",
            text: "Please expedite the repair. It's urgent.",
          },
        ],
        attachments: [
          {
            url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
          },
        ],
      },
      {
        id: "2",
        location: "Building B, Room 202",
        description: "Leaking faucet",
        severity: "low",
        status: 20,
        timestamp: "2024-02-27T11:30:00",
        submittedBy: "Jane Smith",
        assignedTo: "Maintenance Team B",
        comments: [
          {
            author: "Maintenance Team B",
            text: "Faucet repaired.",
          },
        ],
        attachments: [
          {
            url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/leaking-faucet.jpg",
          },
        ],
      },
    ];
    reportRepository.find.mockResolvedValue(mockReports);
    const response = await request(app).get("/api/report");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReports);
  });
  it("should return 404 and No data found", async () => {
    reportRepository.find.mockResolvedValue([]);
    const response = await request(app).get("/api/report");
    expect(response.status).toBe(404);
    expect(response.text).toBe('"No data found"');
  });
  it("should return status 500 when the server encountered an unexpected condition that prevented it from fulfilling the request.", async () => {
    reportRepository.find.mockRejectedValue(new ServerError());
    const response = await request(app).get("/api/report");
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      '"server encountered an unexpected condition that prevented it from fulfilling the request."'
    );
  });
});
describe("GET /api/report/:id", () => {
  it("should return 200 and the report", async () => {
    const mockReports = [
      {
        id: "1",
        location: "Building A, Room 101",
        description: "Cracked wall",
        severity: "high",
        status: 50,
        timestamp: "2024-02-27T10:30:00",
        submittedBy: "John Doe",
        assignedTo: "Maintenance Team A",
        comments: [
          {
            author: "Maintenance Team A",
            text: "Scheduled repair for tomorrow.",
          },
          {
            author: "John Doe",
            text: "Please expedite the repair. It's urgent.",
          },
        ],
        attachments: [
          {
            url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
          },
        ],
      },
      {
        id: "2",
        location: "Building B, Room 202",
        description: "Leaking faucet",
        severity: "low",
        status: 20,
        timestamp: "2024-02-27T11:30:00",
        submittedBy: "Jane Smith",
        assignedTo: "Maintenance Team B",
        comments: [
          {
            author: "Maintenance Team B",
            text: "Faucet repaired.",
          },
        ],
        attachments: [
          {
            url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/leaking-faucet.jpg",
          },
        ],
      },
    ];
    reportRepository.retrieve.mockResolvedValue(mockReports);
    const response = await request(app).get("/api/report/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReports);
  });
});
describe("POST /api/report", () => {
  it("should return 201 and the created report", async () => {
    const mockReports = {
      id: "1",
      location: "Building A, Room 101",
      description: "Cracked wall",
      severity: "high",
      status: 50,
      timestamp: "2024-02-27T10:30:00",
      submittedBy: "John Doe",
      assignedTo: "Maintenance Team A",
      comments: [
        {
          author: "Maintenance Team A",
          text: "Scheduled repair for tomorrow.",
        },
        {
          author: "John Doe",
          text: "Please expedite the repair. It's urgent.",
        },
      ],
      attachments: [
        {
          url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
        },
      ],
    };
    reportRepository.find.mockResolvedValue([]);
    reportRepository.create.mockResolvedValue(mockReports);
    const response = await request(app).post("/api/report").send(mockReports);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockReports);
  });
  it("should return 400 and Invalid form data", async () => {
    const mockReports = {
      id: "1",
    };
    reportRepository.find.mockResolvedValue([]);
    reportRepository.create.mockResolvedValue(mockReports);
    const response = await request(app).post("/api/report").send(mockReports);
    expect(response.status).toBe(400);
    expect(response.text).toBe('"Invalid form data"');
  });
  it("should return 409 and Report of Cracked wall in Building A, Room 101 already in the list", async () => {
    const mockReports = {
      id: "1",
      location: "Building A, Room 101",
      description: "Cracked wall",
      severity: "high",
      status: 50,
      timestamp: "2024-02-27T10:30:00",
      submittedBy: "John Doe",
      assignedTo: "Maintenance Team A",
      comments: [
        {
          author: "Maintenance Team A",
          text: "Scheduled repair for tomorrow.",
        },
        {
          author: "John Doe",
          text: "Please expedite the repair. It's urgent.",
        },
      ],
      attachments: [
        {
          url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
        },
      ],
    };
    reportRepository.find.mockResolvedValue([mockReports]);
    reportRepository.create.mockResolvedValue(mockReports);
    const response = await request(app).post("/api/report").send(mockReports);
    expect(response.status).toBe(409);
    expect(response.text).toBe(
      '"Report of Cracked wall in Building A, Room 101 already in the list"'
    );
  });
  it("should return status 500 when the server encountered an unexpected condition that prevented it from fulfilling the request.", async () => {
    reportRepository.find.mockRejectedValue(new ServerError());
    const response = await request(app).get("/api/report");
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      '"server encountered an unexpected condition that prevented it from fulfilling the request."'
    );
  });
});
describe("PUT /api/report/:id", () => {
  it("should return 200 and the updated report", async () => {
    const mockReports = {
      id: "1",
      location: "Building A, Room 101",
      description: "Cracked wall",
      severity: "high",
      status: 50,
      timestamp: "2024-02-27T10:30:00",
      submittedBy: "John Doe",
      assignedTo: "Maintenance Team A",
      comments: [
        {
          author: "Maintenance Team A",
          text: "Scheduled repair for tomorrow.",
        },
        {
          author: "John Doe",
          text: "Please expedite the repair. It's urgent.",
        },
      ],
      attachments: [
        {
          url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
        },
      ],
    };
    reportRepository.find.mockResolvedValue([mockReports]);
    const response = await request(app).put("/api/report/1").send(mockReports);
    expect(response.status).toBe(200);
    expect(response.body).toEqual("updeated successfully report with id: 1.");
  });
  it("should return 404 and Report with id: 1 does not exist", async () => {
    const mockReports = {
      id: "1",
      location: "Building A, Room 101",
      description: "Cracked wall",
      severity: "high",
      status: 50,
      timestamp: "2024-02-27T10:30:00",
      submittedBy: "John Doe",
      assignedTo: "Maintenance Team A",
      comments: [
        {
          author: "Maintenance Team A",
          text: "Scheduled repair for tomorrow.",
        },
        {
          author: "John Doe",
          text: "Please expedite the repair. It's urgent.",
        },
      ],
      attachments: [
        {
          url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
        },
      ],
    };
    reportRepository.find.mockResolvedValue([]);
    const response = await request(app).put("/api/report/1").send(mockReports);
    expect(response.status).toBe(404);
    expect(response.text).toBe('"Report with id: 1 does not exist"');
  });
  it("should return 404 and required id to update the report.", async () => {
    const response = await request(app).put("/api/report/").send();
    expect(response.status).toBe(404);
    expect(response.text).toBe('"required id to put the report."');
  });
  it("should return 500 and server encountered an unexpected condition that prevented it from fulfilling the request.", async () => {
    reportRepository.find.mockRejectedValue(new ServerError());
    const response = await request(app).put("/api/report/1");
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      '"server encountered an unexpected condition that prevented it from fulfilling the request."'
    );
  });
});
describe("DELETE /api/report/:id", () => {
  it("should return 200 and the deleted report", async () => {
    const mockReports = {
      id: "1",
      location: "Building A, Room 101",
      description: "Cracked wall",
      severity: "high",
      status: 50,
      timestamp: "2024-02-27T10:30:00",
      submittedBy: "John Doe",
      assignedTo: "Maintenance Team A",
      comments: [
        {
          author: "Maintenance Team A",
          text: "Scheduled repair for tomorrow.",
        },
        {
          author: "John Doe",
          text: "Please expedite the repair. It's urgent.",
        },
      ],
      attachments: [
        {
          url: "https://www.icertified.com.au/news/wp-content/uploads/2019/01/cracked-wall-flickr-s2art.jpg",
        },
      ],
    };
    reportRepository.find.mockResolvedValue([mockReports]);
    const response = await request(app).delete("/api/report/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual("report with id: 1 deleted successfully.");
  });
  it("should return 404 and Report with id: 1 does not exist", async () => {
    reportRepository.find.mockResolvedValue([]);
    const response = await request(app).delete("/api/report/1");
    expect(response.status).toBe(404);
    expect(response.text).toBe('"Report with id: 1 does not exist"');
  });
  it("should return 404 and required id to delete the report.", async () => {
    const response = await request(app).delete("/api/report/");
    expect(response.status).toBe(404);
    expect(response.text).toBe('"required id to delete the report."');
  });
  it("should return 500 and server encountered an unexpected condition that prevented it from fulfilling the request.", async () => {
    reportRepository.find.mockRejectedValue(new ServerError());
    const response = await request(app).delete("/api/report/1");
    expect(response.status).toBe(500);
    expect(response.text).toBe(
      '"server encountered an unexpected condition that prevented it from fulfilling the request."'
    );
  });
});

describe("OTHER errors /api/report", () => {
  it("should return 404 and Not Found", async () => {
    const response = await request(app).get("/api/r");
    expect(response.status).toBe(404);
    expect(response.text).toBe('"Not Found"');
  });
  it("should return 404  when the crud is not found", async () => {
    const response = await request(app).patch("/api/report/1");
    expect(response.status).toBe(404);
    expect(response.text).toBe('"Not Found"');
  });
});
