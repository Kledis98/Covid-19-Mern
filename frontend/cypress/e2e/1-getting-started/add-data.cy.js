describe("Add data Test", () => {
  it("Testing Add data in Admin Panel", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('[data-test="username-input"]').type("kledis123");

    cy.get('[data-test="password-input"]').type("kledis123");

    cy.get('[data-test="login-admin-button"]').click();

    cy.url().should("eq", "http://localhost:3000/admin-panel");

    cy.get('[data-test="add-data-option-sidebar"]').click();

    cy.get('[data-test="add-country-dropdown"]').select(
      "6568a39f8146de17edea75de"
    );

    cy.get('[data-test="add-date-picker"]').type("2023-03-12");

    cy.get('[data-test="add-total-cases"]').clear().type("77777");
    cy.get('[data-test="add-total-deaths"]').clear().type("77");
    cy.get('[data-test="add-total-recoveries"]').clear().type("777");

    cy.get('[data-test="add-data-button"]').click();

    cy.get('[data-test="success-message-added-data"]').should("be.visible");
    cy.contains("Data added successfully").should("be.visible");
  });
});
