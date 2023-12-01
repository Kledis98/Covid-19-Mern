describe("Infoboxes", () => {
  it("should display all the infoboxes in the main dashboard", () => {
    cy.visit("http://localhost:3000");

    cy.get('[data-test="country-dropdown"]').select("6568a39f8146de17edea75de");

    cy.get('[data-test="date-input"]').type("2023-03-05");
    cy.get('[data-test="fetch-button"]').click();

    cy.get('[data-test="grid-container"]').should("be.visible");
    cy.get('[data-test="grid-first-row"]').should("be.visible");

    cy.get('[data-test="grid-second-row"]').should("be.visible");
  });
});
