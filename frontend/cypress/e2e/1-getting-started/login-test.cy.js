describe("Login Button", () => {
  it("should navigate to /login when the login button is clicked", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-test = "login-button"]').click();

    cy.url().should("include", "/login");
  });
});
