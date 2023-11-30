// cypress/integration/your_test_spec.js

describe("Your Test Suite", () => {
  it("should display 6 infoboxes after selecting country, date, and clicking fetch data", () => {
    // Visit your application
    cy.visit("http://localhost:3000/");

    // Interact with the dropdown to select a country
    cy.get('[data-test="country-dropdown"]').select(
      "6560d09c1250b04f8e66231f",
      {
        force: true,
      }
    );

    // Interact with the date input to select a date
    cy.get('[data-test="date-input"]').type("2023-01-01");

    // Interact with the fetch data button
    cy.get('[data-test="fetch-button"]').click();

    // Assert that the 6 infoboxes are visible
    cy.get('[data-test="grid-container"]').should("exist").should("be.visible");
    cy.get('[data-test="grid-container"] [data-test="grid-first-row"]').should(
      "exist"
    );
    cy.get('[data-test="grid-container"] [data-test="grid-second-row"]').should(
      "exist"
    );
  });
});
