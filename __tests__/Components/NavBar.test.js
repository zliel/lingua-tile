import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "../../src/Components/NavBar";
import { AuthContext, AuthProvider } from "../../src/Contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";

describe("NavBar", () => {
  it("renders LinguaTile link", () => {
    render(
      <MemoryRouter>
        <AuthProvider value={{ auth: { isLoggedIn: false } }}>
          <NavBar onThemeSwitch={() => {}} />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("LinguaTile")).toBeTruthy();
  });

  it("renders login and signup buttons when user is not logged in", () => {
    render(
      <MemoryRouter>
        <AuthProvider value={{ auth: { isLoggedIn: false } }}>
          <NavBar onThemeSwitch={() => {}} />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Login")).toBeTruthy();
    expect(screen.getByText("Sign Up")).toBeTruthy();
  });

  it("renders profile and logout buttons when user is logged in", () => {
    render(
      <MemoryRouter>
        <AuthProvider
          value={{ auth: { isLoggedIn: true, username: "testuser" } }}
        >
          <NavBar onThemeSwitch={() => {}} />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Profile")).toBeTruthy();
    expect(screen.getByText("Logout")).toBeTruthy();
  });

  it("calls onThemeSwitch when theme switch is toggled", () => {
    const onThemeSwitch = jest.fn();
    render(
      <MemoryRouter>
        <AuthProvider value={{ auth: { isLoggedIn: false } }}>
          <NavBar onThemeSwitch={onThemeSwitch} />
        </AuthProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onThemeSwitch).toHaveBeenCalled();
  });

  it("opens and closes menu when menu button is clicked", () => {
    render(
      <MemoryRouter>
        <AuthProvider value={{ auth: { isLoggedIn: false } }}>
          <NavBar onThemeSwitch={() => {}} />
        </AuthProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByLabelText("menu"));
    expect(screen.getByText("Home")).toBeTruthy();
  });

  it("calls logout and navigates to home when logout button is clicked", () => {
    const logout = jest.fn((callback) => callback());
    const navigate = jest.fn();
    render(
      <MemoryRouter>
        <AuthProvider
          value={{ auth: { isLoggedIn: true, username: "testuser" }, logout }}
        >
          <NavBar onThemeSwitch={() => {}} />
        </AuthProvider>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText("Logout"));
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/");
  });
});
