// cypress/integration/your_test_spec.js

describe("Your Test Suite", () => {
  it("should display the selected country in the dropdown", () => {
    // Visit your application
    cy.visit("http://localhost:3000/");

    // Interact with the dropdown to select a country
    cy.get('[data-test="country-dropdown"]').select("6568a39f8146de17edea75de");

    // Assert the selected option text is "Albania"
    cy.get('[data-test="country-dropdown"]')
      .find(":selected")
      .should("have.text", "Albania");
  });
});
