describe("Delete Test", () => {
  it("Testing Delete in Admin Panel", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('[data-test="username-input"]').type("kledis123");

    cy.get('[data-test="password-input"]').type("kledis123");

    cy.get('[data-test="login-admin-button"]').click();

    cy.url().should("eq", "http://localhost:3000/admin-panel");

    cy.get('[data-test="modify-data-option"]').click();

    cy.get('[data-test="modify-country-dropdown"]').select(
      "6568a39f8146de17edea75de"
    );
    cy.get('[data-test="modify-date-input"]').type("2023-03-12");

    cy.get('[data-test="modify-fetch-button"]').click();

    cy.get('[data-test="info-box"]').should("be.visible");

    // Type values in the input fields for modification
    cy.get('[data-test="modify-totalCases"]').clear().type("99999");
    cy.get('[data-test="modify-totalRecoveries"]').clear().type("999");
    cy.get('[data-test="modify-totalDeaths"]').clear().type("99");

    // Click the modify data button
    cy.get('[data-test="modify-data-button"]').click();

    // Check if the InfoBoxes are updated with modified data
    cy.get('[data-test="info-box"]').should("be.visible");
    cy.get('[data-test="info-box-total-cases"]').should(
      "contain.text",
      "99999"
    );
    cy.get('[data-test="info-box-total-recoveries"]').should(
      "contain.text",
      "999"
    );
    cy.get('[data-test="info-box-total-deaths"]').should("contain.text", "99");
  });
});
