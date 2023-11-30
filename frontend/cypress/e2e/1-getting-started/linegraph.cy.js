// cypress/integration/your_test_spec.js

describe("Your Test Suite", () => {
  it("should display LineGraph after selecting a country", () => {
    // Visit your application
    cy.visit("http://localhost:3000/");

    // Interact with the dropdown to select a country
    cy.get('[data-test="country-dropdown"]').select(
      "6560d09c1250b04f8e66231f",
      {
        force: true,
      }
    );

    // Assert that the LineGraph component is in the DOM
    cy.get('[data-test = "table-linegraph-right"]')
      .should("exist")
      .find('[data-test="line-graph"]')
      .should("be.visible");
  });
});
