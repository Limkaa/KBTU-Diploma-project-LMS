import loginData from '/cypress/fixtures/login-data.json';

function authorization() {
    cy.viewport(1600, 900);
    cy.visit('/');
    cy.get('.form').should('contain', 'StudyMate');
    cy.get('#basic_email').type(loginData.email_manager);
    cy.get('#basic_password').type(loginData.password);
    cy.get('button').click();
    cy.get('.ant-menu').should('contain', 'StudyMate');
}

describe('studymate.kz Users UI test', function () {
    //doing auth before each iteration
    before(() => {
        authorization();
    });
    it('should create new user', () => {
        cy.get('.ant-menu-title-content > a[href *="/users"]').click();
        cy.get('.ant-btn').click();
    //filling the creating user form    
        cy.get('form input[name=first_name]').type('Alexander');
        cy.get('form input[name=last_name]').type('Ivanov');
        cy.get('form input[name=email]').type('alex@gmail.com');
        cy.get('form input[name=password]').type('123');
        cy.get('form input[name=phone]').type('8777000111');
        cy.get('form input[name=date_of_birth]').click().type('2000-10-10');
        cy.get('form .MuiInputBase-root > #role').click();
        cy.get('[data-value="teacher"]').click();
        cy.get('form .MuiInputBase-root > #gender').click();
        cy.get('[data-value="male"]').click();
        cy.get('form > button').click();

        cy.get('[data-row-key] > :nth-child(1) > div').should('contain', 'Alexander Ivanov');
    })
})