import loginData from '/cypress/fixtures/login-data.json';

function authorization() {
    cy.viewport(1600, 900);
    cy.visit('/');
    cy.get('.form').should('contain', 'StudyMate');
    cy.get('#basic_email').type(loginData.email_teacher);
    cy.get('#basic_password').type(loginData.password);
    cy.get('button').click();
    cy.get('.ant-menu').should('contain', 'StudyMate');
}

describe('studymate.kz School UI test', function () {
    //doing auth before each iteration
    before(() => {
        authorization();
    });
    it('should create assignment', () => {
        cy.visit('/assignments');
        cy.get('.ant-btn').should('contain', 'Create assignment').click();
        cy.get('.MuiInputBase-root > #term').click();
        cy.get('[data-value="14"] > div').click();
        cy.get('.MuiInputBase-root > #course').click();
        cy.get('.MuiList-root > [tabindex="0"]').click();
        cy.get('#\\:rm\\:').clear().type('New Assignment');
        cy.get('#\\:rn\\:').clear().type('New Assignment Description');
        cy.get('.ant-picker-input > input').click()
            .clear()
            .type('2023-06-10 23:53:32')
            .type('{enter}');
        cy.get('form > button').click();
    })
    it('should update assignment', () => {
        cy.get('a[href="/assignments/145"]').click();
        cy.get('[style="display: flex; gap: 12px;"] > img').click();
        cy.get(':nth-child(1) > .ant-input').clear().type('Updated Assignment');
        cy.get('[style="margin-top: 25px; width: 55%;"] > .ant-input').clear().type('Updated Assignment Description');
        cy.get('span').contains('Save').click();
        cy.get('.ant-tabs-content-holder').should('contain','Updated Assignment');
    })

})