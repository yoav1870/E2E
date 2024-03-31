const app = require("../server");
const { reportRepository } = require("../repositories/report.repository");
const { UserRepository } = require("../repositories/user.repository");
const request = require("supertest");
jest.mock("../repositories/report.repository");
jest.mock("../repositories/user.repository");
const { ServerError } = require("../errors/general.error");

// describe("GET /api/reports", () => {
//   it("should return all reports with status 200", async () => {
//     const mockReports = [
//       {
//         _id: "6606b270432e277cbd32906b",
//         location: {
//           type: "Point",
//           coordinates: [34.781768, 32.0853], // Coordinates for Tel Aviv
//         },
//         description:
//           "Frequent power interruptions in residential area, suspected fuse box issue",
//         status: "pending",
//         photo: null,
//         urgency: 4,
//         reportByUser: "6602c0d94957a092f3742078",
//         assignedUser: "6602c13b4957a092f374207e",
//         profession: "Electrician",
//         dateOfResolve: "2024-07-16T14:00:00.000Z",
//         resolved: false,
//         createdAt: "2024-03-29T12:22:08.835Z",
//         updatedAt: "2024-03-29T12:22:08.835Z",
//         __v: 0,
//       },
//       {
//         _id: "6606b270432e277cbd32906c",
//         location: {
//           type: "Point",
//           coordinates: [35.21371, 31.768319], // Coordinates for Jerusalem
//         },
//         description: "Broken water main causing flooding on Main St.",
//         status: "in_progress",
//         photo: "url/to/photo_of_flooding.jpg",
//         urgency: 5,
//         reportByUser: "6602c0d94957a092f3742078",
//         assignedUser: "6602c13b4957a092f374207f",
//         profession: "Plumber",
//         dateOfResolve: "2024-07-20T14:00:00.000Z",
//         resolved: false,
//         createdAt: "2024-03-30T12:22:08.835Z",
//         updatedAt: "2024-03-30T12:22:08.835Z",
//         __v: 0,
//       },
//     ];

//     reportRepository.find.mockResolvedValue(mockReports);

//     const response = await request(app).get("/api/reports");
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockReports);
//   });
//   it("should return no data with status 404", async () => {
//     reportRepository.find.mockResolvedValue([]);
//     const response = await request(app).get("/api/reports");
//     expect(response.status).toBe(404);
//     expect(response.body).toBe("No data found at getAllReports .");
//   });
//   it("should return status 500 when the server encountered an unexpected condition that prevented it from fulfilling the request", async () => {
//     reportRepository.find.mockRejectedValue(new ServerError());
//     const response = await request(app).get("/api/reports");
//     expect(response.status).toBe(500);
//     expect(response.body).toBe(
//       "server encountered an unexpected condition that prevented it from fulfilling the request."
//     );
//   });
// });

// describe("GET /api/reports/:id", () => {
//   it("should return a report with status 200", async () => {
//     const mockReport = {
//       _id: "6606b270432e277cbd32906b",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       assignedUser: "6602c13b4957a092f374207e",
//       profession: "Electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//       resolved: false,
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };

//     reportRepository.retrieve.mockResolvedValue(mockReport);

//     const response = await request(app).get(
//       "/api/reports/6606b270432e277cbd32906b"
//     );
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockReport);
//   });
//   it("should return no data with status 404", async () => {
//     reportRepository.retrieve.mockResolvedValue(null);
//     const response = await request(app).get(
//       "/api/reports/6606b270432e277cbd32906b"
//     );
//     expect(response.status).toBe(404);
//     expect(response.body).toBe(
//       "No data found at getReport with id 6606b270432e277cbd32906b ."
//     );
//   });
//   it("should return status 500 when the server encountered an unexpected condition that prevented it from fulfilling the request", async () => {
//     reportRepository.retrieve.mockRejectedValue(new ServerError());
//     const response = await request(app).get(
//       "/api/reports/6606b270432e277cbd32906b"
//     );
//     expect(response.status).toBe(500);
//     expect(response.body).toBe(
//       "server encountered an unexpected condition that prevented it from fulfilling the request."
//     );
//   });
// });

// describe("POST /api/reports", () => {
//   it("should create a report with status 201", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     const mockRequest = {
//       _id: "6602c0d94957a092f3742078",
//       username: "test",
//       email: "example@gmail.com",
//       password: "123456",
//       role: "service_request",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "test",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     const mockProvider = {
//       _id: "6602c0d94957a092f374999",
//       username: "provider",
//       email: "example@gmail.com",
//       password: "11111",
//       role: "service_provider",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "provider",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     UserRepository.retrieve.mockResolvedValue(mockRequest);
//     UserRepository.findNearbyAndByProfession.mockResolvedValue([mockProvider]);

//     reportRepository.create.mockResolvedValue(mockReport);
//     UserRepository.updateReports.mockResolvedValue(mockProvider);
//     UserRepository.updateReports.mockResolvedValue(mockRequest);

//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(201);
//     expect(response.body).toBe("Report created");
//   });
//   it("should return status 400 when the user that submited the report is not a service request", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     const mockProvider = {
//       _id: "6602c0d94957a092f374999",
//       username: "provider",
//       email: "example@gmail.com",
//       password: "11111",
//       role: "service_provider",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "provider",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     UserRepository.retrieve.mockResolvedValue(mockProvider);
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(400);
//     expect(response.body).toBe(
//       "User that submited the report is not a service request"
//     );
//   });
//   it("should return status 400 when the user didnt provide all required fields", async () => {
//     const mockReport = {
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     const mockRequest = {
//       _id: "6602c0d94957a092f3742078",
//       username: "test",
//       email: "example@gmail.com",
//       password: "123456",
//       role: "service_request",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "test",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     UserRepository.retrieve.mockResolvedValue(mockRequest);
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(400);
//     expect(response.body).toBe(
//       "Please provide all required fields at createReport"
//     );
//   });
//   it("should return status 400 when no service provider available in the area", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     const mockRequest = {
//       _id: "6602c0d94957a092f3742078",
//       username: "test",
//       email: "example@gmail.com",
//       password: "123456",
//       role: "service_request",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "test",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     const mockProvider = {
//       _id: "6602c0d94957a092f374999",
//       username: "provider",
//       email: "example@gmail.com",
//       password: "11111",
//       role: "service_provider",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "provider",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     UserRepository.retrieve.mockResolvedValue(mockRequest);
//     UserRepository.findNearbyAndByProfession.mockResolvedValue([]);
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(400);
//     expect(response.body).toBe(
//       "No service provider available for this report plz try again later"
//     );
//   });
//   it("should return status 400 when failed to create a report", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     const mockRequest = {
//       _id: "6602c0d94957a092f3742078",
//       username: "test",
//       email: "example@gmail.com",
//       password: "123456",
//       role: "service_request",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "test",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     const mockProvider = {
//       _id: "6602c0d94957a092f374999",
//       username: "provider",
//       email: "example@gmail.com",
//       password: "11111",
//       role: "service_provider",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "provider",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     UserRepository.retrieve.mockResolvedValue(mockRequest);
//     UserRepository.findNearbyAndByProfession.mockResolvedValue([mockProvider]);
//     reportRepository.create.mockResolvedValue(null);
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(400);
//     expect(response.body).toBe("Failed to create a report");
//   });
//   it("should return status 400 when the new date of the report is earlier than the current date", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-01-16T14:00:00.000Z",
//     };
//     const mockRequest = {
//       _id: "6602c0d94957a092f3742078",
//       username: "test",
//       email: "example@gmail.com",
//       password: "123456",
//       role: "service_request",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "test",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     const mockProvider = {
//       _id: "6602c0d94957a092f374999",
//       username: "provider",
//       email: "example@gmail.com",
//       password: "11111",
//       role: "service_provider",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "provider",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     UserRepository.retrieve.mockResolvedValue(mockRequest);
//     UserRepository.findNearbyAndByProfession.mockResolvedValue([mockProvider]);
//     reportRepository.create.mockResolvedValue(mockReport);
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(400);
//     expect(response.body).toBe(
//       "Date of resolve must be later than current date"
//     );
//   });
//   it("should return status 400 when failed to update the service provider", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     const mockRequest = {
//       _id: "6602c0d94957a092f3742078",
//       username: "test",
//       email: "example@gmail.com",
//       password: "123456",
//       role: "service_request",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "test",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };
//     const mockProvider = {
//       _id: "6602c0d94957a092f374999",
//       username: "provider",
//       email: "example@gmail.com",
//       password: "11111",
//       role: "service_provider",
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description: "provider",
//       profession: "electrician",
//       availability: true,
//       ranking: 5,
//       photo: null,
//       reports: [],
//       createdAt: "2024-03-29T12:22:08.835Z",
//       updatedAt: "2024-03-29T12:22:08.835Z",
//       __v: 0,
//     };

//     UserRepository.retrieve.mockResolvedValue(mockRequest);
//     UserRepository.findNearbyAndByProfession.mockResolvedValue([mockProvider]);
//     reportRepository.create.mockResolvedValue(mockReport);
//     UserRepository.updateReports.mockResolvedValue(null);
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(400);
//     expect(response.body).toBe("Failed to update the service provider");
//   });

//   it("should return status 500 when the server encountered an unexpected condition that prevented it from fulfilling the request", async () => {
//     const mockReport = {
//       location: {
//         type: "Point",
//         coordinates: [34.781768, 32.0853],
//       },
//       description:
//         "Frequent power interruptions in residential area, suspected fuse box issue",
//       status: "pending",
//       photo: null,
//       urgency: 4,
//       reportByUser: "6602c0d94957a092f3742078",
//       profession: "electrician",
//       dateOfResolve: "2024-07-16T14:00:00.000Z",
//     };
//     UserRepository.retrieve.mockRejectedValue(new ServerError());
//     const response = await request(app).post("/api/reports").send(mockReport);
//     expect(response.status).toBe(500);
//     expect(response.body).toBe(
//       "server encountered an unexpected condition that prevented it from fulfilling the request."
//     );
//   });
// });
