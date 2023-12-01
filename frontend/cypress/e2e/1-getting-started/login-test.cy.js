// cypress/integration/loginButton.spec.js

describe("Login Button", () => {
  it("should navigate to /login when the login button is clicked", () => {
    // Visit the page containing the login button
    cy.visit("http://localhost:3000/"); // Update the URL as needed

    // Click the login button
    cy.get('[data-test = "login-admin-button"]').click();

    // Wait for the navigation to complete
    cy.url().should("include", "/login");
  });
});
