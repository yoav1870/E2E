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

describe("POST /api/reports", () => {
  it("should create a report with status 201", async () => {
    const mockReport = {
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description:
        "Frequent power interruptions in residential area, suspected fuse box issue",
      status: "pending",
      photo: null,
      urgency: 4,
      reportByUser: "6602c0d94957a092f3742078",
      profession: "electrician",
      dateOfResolve: "2024-07-16T14:00:00.000Z",
    };
    const mockRequest = {
      _id: "6602c0d94957a092f3742078",
      username: "test",
      email: "example@gmail.com",
      password: "123456",
      role: "service_request",
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description: "test",
      profession: "electrician",
      availability: true,
      ranking: 5,
      photo: null,
      reports: [],
      createdAt: "2024-03-29T12:22:08.835Z",
      updatedAt: "2024-03-29T12:22:08.835Z",
      __v: 0,
    };
    const mockProvider = {
      _id: "6602c0d94957a092f374999",
      username: "provider",
      email: "example@gmail.com",
      password: "11111",
      role: "service_provider",
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description: "provider",
      profession: "electrician",
      availability: true,
      ranking: 5,
      photo: null,
      reports: [],
      createdAt: "2024-03-29T12:22:08.835Z",
      updatedAt: "2024-03-29T12:22:08.835Z",
      __v: 0,
    };
    UserRepository.retrieve.mockResolvedValue(mockRequest);
    UserRepository.findNearbyAndByProfession.mockResolvedValue([mockProvider]);

    reportRepository.create.mockResolvedValue(mockReport);
    UserRepository.updateReports.mockResolvedValue(mockProvider);
    UserRepository.updateReports.mockResolvedValue(mockRequest);

    const response = await request(app).post("/api/reports").send(mockReport);
    expect(response.status).toBe(201);
    expect(response.body).toBe("Report created");
  });
  it("should return status 400 when the user that submited the report is not a service request", async () => {
    const mockReport = {
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description:
        "Frequent power interruptions in residential area, suspected fuse box issue",
      status: "pending",
      photo: null,
      urgency: 4,
      reportByUser: "6602c0d94957a092f3742078",
      profession: "electrician",
      dateOfResolve: "2024-07-16T14:00:00.000Z",
    };
    const mockProvider = {
      _id: "6602c0d94957a092f374999",
      username: "provider",
      email: "example@gmail.com",
      password: "11111",
      role: "service_provider",
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description: "provider",
      profession: "electrician",
      availability: true,
      ranking: 5,
      photo: null,
      reports: [],
      createdAt: "2024-03-29T12:22:08.835Z",
      updatedAt: "2024-03-29T12:22:08.835Z",
      __v: 0,
    };
    UserRepository.retrieve.mockResolvedValue(mockProvider);
    const response = await request(app).post("/api/reports").send(mockReport);
    expect(response.status).toBe(400);
    expect(response.body).toBe(
      "User that submited the report is not a service request"
    );
  });
  it("should return status 400 when the user didnt provide all required fields", async () => {
    const mockReport = {
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description:
        "Frequent power interruptions in residential area, suspected fuse box issue",
      status: "pending",
      photo: null,
      urgency: 4,
      reportByUser: "6602c0d94957a092f3742078",
      profession: "electrician",
      dateOfResolve: "2024-07-16T14:00:00.000Z",
    };
    const mockRequest = {
      _id: "6602c0d94957a092f3742078",
      username: "test",
      email: "example@gmail.com",
      password: "123456",
      role: "service_request",
      location: {
        type: "Point",
        coordinates: [34.781768, 32.0853],
      },
      description: "test",
      profession: "electrician",
      availability: true,
      ranking: 5,
      photo: null,
      reports: [],
      createdAt: "2024-03-29T12:22:08.835Z",
      updatedAt: "2024-03-29T12:22:08.835Z",
      __v: 0,
    };
    // it("should return status 500 when the server encountered an unexpected condition that prevented it from fulfilling the request", async () => {
    //   const mockReport = {
    //     location: {
    //       type: "Point",
    //       coordinates: [34.781768, 32.0853],
    //     },
    //     description:
    //       "Frequent power interruptions in residential area, suspected fuse box issue",
    //     status: "pending",
    //     photo: null,
    //     urgency: 4,
    //     reportByUser: "6602c0d94957a092f3742078",
    //     assignedUser: "6602c13b4957a092f374207e",
    //     profession: "Electrician",
    //     dateOfResolve: "2024-07-16T14:00:00.000Z",
    //   };

    //   reportRepository.create.mockRejectedValue(new ServerError());

    //   const response = await request(app).post("/api/reports").send(mockReport);
    //   expect(response.status).toBe(500);
    //   expect(response.body).toBe(
    //     "server encountered an unexpected condition that prevented it from fulfilling the request."
    //   );
    // });
  });
});

//  async createReport(req, res) {
//     try {
//       const body = req.body;
//       userSubmit = await UserRepository.retrieve(body.reportByUser);
//       if (!userSubmit) {
//         throw new DataNotExistsError("createReport", body.reportByUser);
//       }
//       if (userSubmit.role !== "service_request") {
//         throw new FormError(
//           "User that submited the report is not a service request"
//         );
//       }
//       if (
//         body.location &&
//         body.description &&
//         body.status &&
//         body.urgency &&
//         body.reportByUser &&
//         body.profession &&
//         body.dateOfResolve
//       ) {
//         //find the nearest service provider by profession and by location up to 20km
//         const serviceProviders = await UserRepository.findNearbyAndByProfession(
//           body.location,
//           body.profession
//         );
//         if (!serviceProviders) {
//           throw new NoDataError("createReport. No service provider available");
//         }
//         // sort the service providers by ranking in the 20km radius
//         serviceProviders.sort((a, b) => b.ranking - a.ranking);
//         // check if the service provider has a report on the same date

//         const assignedServiceProvider = await findAvailableServiceProvider(
//           serviceProviders,
//           body
//         );
//         if (!assignedServiceProvider) {
//           throw new NoProviderAvailableError(
//             "No service provider available for this report plz try again later"
//           );
//         }
//         const newReport = {
//           location: body.location,
//           description: body.description,
//           status: body.status,
//           photo: body.photo,
//           urgency: body.urgency,
//           reportByUser: body.reportByUser,
//           dateOfResolve: body.dateOfResolve,
//           assignedUser: assignedServiceProvider,
//           profession: body.profession,
//         };
//         const result = {
//           status: 201,
//           data: await reportRepository.create(newReport),
//         };
//         if (!result.data) {
//           throw new FailedCRUD("Failed to create a report");
//         }
//         assignedServiceProvider.reports.push(result.data._id);
//         const updateResult = await UserRepository.updateReports(
//           assignedServiceProvider._id,
//           assignedServiceProvider.reports
//         );
//         if (!updateResult) {
//           throw new FailedCRUD("Failed to update the service provider");
//         }
//         userSubmit.reports.push(result.data._id);
//         const updateResultUser = await UserRepository.updateReports(
//           userSubmit._id,
//           userSubmit.reports
//         );
//         if (!updateResultUser) {
//           throw new FailedCRUD("Failed to update the user");
//         }
//         const emailResult = await sendReportNotificationForCreateNewReport(
//           userSubmit.email,
//           userSubmit.username,
//           assignedServiceProvider.email,
//           assignedServiceProvider.username
//         );
//         if (emailResult === null) {
//           console.error("Failed to send email");
//         }
//         res.status(result.status).json("Report created");
//       } else {
//         throw new FormError(
//           "Please provide all required fields at createReport"
//         );
//       }
//     } catch (error) {
//       res.status(error?.status || 500).json(error.message);
//     }
//   },
// const { Schema, model } = require("mongoose");

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: [true, "A user must have a username"],
//     },
//     email: {
//       type: String,
//       required: [true, "A user must have an email"],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "A user must have a password"],
//     },
//     role: {
//       type: String,
//       enum: ["service_request", "service_provider"],
//       required: [true, "A user must have a role"],
//     },
//     location: {
//       type: { type: String, enum: ["Point"], default: "Point" },
//       coordinates: {
//         type: [Number],
//         required: [true, "A user must have coordinates"],
//       },
//     },
//     description: {
//       type: String,
//     },
//     profession: {
//       type: String,
//     },
//     availability: {
//       type: Boolean,
//     },
//     ranking: {
//       type: Number,
//       enum: [1, 2, 3, 4, 5],
//     },
//     photo: {
//       type: String,
//       default: null,
//     },
//     reports: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "damageReport.model",
//       },
//     ],
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { collection: "user_admin", timestamps: true }
// );

// userSchema.path("profession").required(function () {
//   return this.role === "service_provider";
// });

// userSchema.path("availability").required(function () {
//   return this.role === "service_provider";
// });

// userSchema.path("ranking").required(function () {
//   return this.role === "service_provider";
// });

// userSchema.index({ location: "2dsphere" });

// const User = model("user", userSchema);

// module.exports = User;
