describe("Delete Test", () => {
  it("Testing Delete in Admin Panel", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('[data-test="username-input"]').type("kledis123");

    cy.get('[data-test="password-input"]').type("kledis123");

    cy.get('[data-test="login-admin-button"]').click();

    cy.url().should("eq", "http://localhost:3000/admin-panel");

    cy.get('[data-test="logout-button"]').click();

    cy.url().should("include", "/");

    cy.visit("http://localhost:3000/admin-panel");

    cy.contains("You do not have access to this route!").should("be.visible");
  });
});
