describe("Login Test", () => {
  it("should log in with username and password", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('[data-test="username-input"]').type(
      Cypress.env("CYPRESS_USERNAME")
    );

    cy.get('[data-test="password-input"]').type(
      Cypress.env("CYPRESS_PASSWORD")
    );

    cy.get('[data-test="login-admin-button"]').click();

    cy.url().should("eq", "http://localhost:3000/admin-panel");
  });
});
