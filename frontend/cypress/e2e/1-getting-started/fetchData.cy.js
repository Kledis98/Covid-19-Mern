// cypress/integration/your_test_spec.js

describe("Your Test Suite", () => {
  it("should display the selected country in the dropdown", () => {
    cy.visit("http://localhost:3000");

    cy.get('[data-test="country-dropdown"]').select("6568a39f8146de17edea75de");

    cy.get('[data-test="country-dropdown"]')
      .find(":selected")
      .should("have.text", "Albania");
  });
});
