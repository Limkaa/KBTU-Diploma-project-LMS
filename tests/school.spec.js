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

describe('studymate.kz School UI test', function () {
    //doing auth before each iteration
    before(() => {
        authorization();
    });
    it('should check school description', () => {
        cy.visit('/school');
        cy.get('[style="display: flex; align-items: center;"] > img').click();
        cy.get('input[placeholder="School Title"]').clear().type('School #2');
        cy.get('.address').clear().type('Tole bi 59');
        cy.get('textarea[placeholder="Description"]').clear().type('School number 2 is located on Tole bi 59');
        cy.get('[style="margin-top: 40px; display: flex; justify-content: flex-end;"] > .ant-btn > span').click();
        cy.get('.title').should('have.text', 'School #2');
    })
    it('should check school posts', () => {
        cy.get('[style="display: flex; width: 100%; position: fixed; left: 250px; bottom: 0px; min-height: 70px; background-color: rgb(248, 249, 250); border-top: 1px solid rgba(92, 92, 92, 0.1);"] > .ant-btn')
            .click();
        cy.get('#basic_title').type('New post');
        cy.get('#basic_text').type("New post's text");
        cy.get('#basic > .ant-btn').click();
    })
    it('should left the comment ot post', () => {
        cy.get(':nth-child(2) > [style="background-color: rgb(248, 249, 250);"] > .ant-btn > span').click();
        cy.get('.ant-space-compact > .ant-input').type('New comment');
        cy.get('.ant-space-compact > .ant-btn').click();
    })
})