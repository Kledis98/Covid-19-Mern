describe("Delete Test", () => {
  it("Testing Delete in Admin Panel", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('[data-test="username-input"]').type("kledis123");

    cy.get('[data-test="password-input"]').type("kledis123");

    cy.get('[data-test="login-admin-button"]').click();

    cy.url().should("eq", "http://localhost:3000/admin-panel");

    cy.get('[data-test="delete-option-sidebar"]').click();

    cy.get('[data-test="delete-country-dropdown"]').select(
      "6568a39f8146de17edea75de"
    );

    cy.get('[data-test="delete-date-picker"]').type("2023-03-12");

    cy.get('[data-test="delete-data-button"]').click();

    cy.get('[data-test="success-message-deleted-data"]').should("be.visible");
    cy.contains("Data deleted successfully").should("be.visible");
  });
});
