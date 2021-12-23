describe('Booking page test', function() {
  it('Starting booking page', function() {
    cy.visit('http://localhost:3000/');
    cy.contains('Booking Table');
    cy.contains('CREATE NEW BOOKING').click();
    cy.url().should('include', '/roomdetail');
  });
});
