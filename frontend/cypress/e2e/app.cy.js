describe('Trade Tracker App', () => {
  it('Carga la página principal y muestra el header', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Trade Tracker App').should('be.visible');
    cy.contains('Demostración de Componentes').should('be.visible');
    cy.contains('Posts de Ejemplo').should('be.visible');
  });
}); 