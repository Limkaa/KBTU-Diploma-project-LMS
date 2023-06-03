import loginData from '/cypress/fixtures/login-data.json';

function authorization() {
    cy.viewport(1600, 900);
    cy.visit('/');
    cy.get('.form').should('contain', 'StudyMate');
    cy.get('#basic_email').type(loginData.email_student);
    cy.get('#basic_password').type(loginData.password);
    cy.get('button').click();
    cy.get('.ant-menu').should('contain', 'StudyMate');
}

describe('studymate.kz Users UI test', function () {
    //doing auth before each iteration
    before(() => {
        authorization();
    });
    it('should check todo', () => {
        cy.visit('/todo');
        cy.get('.ant-btn').click();
        cy.get('#add-modal').should('contain', 'New Todo');
        cy.get('#\\:rk\\:').type('New TODO');
        cy.get('#\\:rl\\:').type('New TODO desctiption');
        cy.get('#add-modal > .modal > button').click()
    })
    it('should change todo', ()=>{
        cy.viewport(1600, 900);
        cy.get('[style="border-color: rgb(242, 184, 36);"] > :nth-child(2) > .anticon-edit > svg > path').click({force:true});
        cy.get('#\\:rn\\:').clear().type('new updated todo');
        cy.get('#\\:ro\\:').clear().type('New updated todo description');
        cy.get('.modal > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').click();
        cy.get('#update-todo > .modal > button').click();
    })
})