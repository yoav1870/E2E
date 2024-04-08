import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import EditProfile from "../EditProfile";
import Profile from "../Profile";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("EditProfile", () => {
  beforeEach(() => {
    // Mock user data returned by the API
    const mockUserData = {
      location: {
        type: "Point",
        coordinates: [35.0896, 32.794],
      },
      _id: "660b9e690434af97a9c2082f",
      username: "plumberHaifa",
      email: "plumberhaifa@gmail.com",
      password: "password123",
      role: "service_provider",
      description: "An not experienced plumber based in Haifa",
      profession: "plumber",
      availability: true,
      ranking: 1,
      photo: null,
      reports: [],
      createdAt: "2024-04-02T05:58:01.904Z",
      updatedAt: "2024-04-02T05:58:01.904Z",
      __v: 0,
    };

    // Mock the API request for fetching user data
    axios.get.mockResolvedValueOnce({ data: mockUserData });
  });

  it("should update the password and navigate to the profile page", async () => {
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjBiYjI2OWFkNjVhOTdiNWI2MTk5N2MiLCJyb2xlIjoic2VydmljZV9wcm92aWRlciIsImlhdCI6MTcxMjA0MjY2OSwiZXhwIjoxNzEyMTI5MDY5fQ.OgV7--alafh_j-XJH4lXuZppXKUaMiCCWaoM-3SeoP4";
    localStorage.setItem("token", mockToken);

    axios.put.mockResolvedValueOnce({ data: "Password has been updated" });

    const mockNavigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/edit-profile"]}>
        <Routes>
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    const oldPasswordInput = getByLabelText("Old Password");
    const newPasswordInput = getByLabelText("New Password");
    const updateButton = getByText("Update Password");

    fireEvent.change(oldPasswordInput, { target: { value: "password123" } });
    fireEvent.change(newPasswordInput, {
      target: { value: "password123update" },
    });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "https://e2e-y8hj.onrender.com/api/users/updatePassword",
        { oldPassword: "password123", newPassword: "password123update" },
        { headers: { Authorization: `Bearer ${mockToken}` } }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/profile", {
        state: { passwordUpdated: true },
      });
    });
  });
});
