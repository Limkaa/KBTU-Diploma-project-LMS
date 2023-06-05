import loginData from '/cypress/fixtures/login-data.json';

describe('studymate.kz School UI test', function () {

 
    it("POST API testing Login", () => {
        cy.api("POST", "localhost:8000/api/auth/token/obtain", {
            email: "user44@gmail.com",
            password: "123",
        }).should((response) => {
            expect(response.status).to.eq(200);
        });
    });
    //just chcecking hardcode
    it("POST API testing Refresh", () => {
        cy.api("POST", "localhost:8000/api/auth/token/refresh", {
            refresh: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTg4MDA5NSwiaWF0IjoxNjg1NzkzNjk1LCJqdGkiOiJmMDQxMGY4MWVhZDg0MmIwYjYwNDhlNDA0ZDFiOTZhZiIsInVzZXJfaWQiOjQ0LCJlbWFpbCI6InVzZXI0NEBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsInNjaG9vbF9pZCI6MSwiZmlyc3RfbmFtZSI6IkRlbm55IiwibGFzdF9uYW1lIjoiV2hpdGNvbWIifQ.lpsscUJ1ZI20ab6NfQG55MTYjGvrm2yr-MLWPhz_aP4",
        }).should((response) => {
            expect(response.status).to.eq(200);
        });
    });
    it("POST API testing Verify", () => {
        cy.api("POST", "localhost:8000/api/auth/token/verify", {
            access:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg1Nzg0NDIyLCJpYXQiOjE2ODU3ODMwOTEsImp0aSI6ImQ4MGZkNWQwYmU4MjQxMmRhNGZkYzBjNWZkNWYyZmU1IiwidXNlcl9pZCI6NDQsImVtYWlsIjoidXNlcjQ0QGdtYWlsLmNvbSIsInJvbGUiOiJtYW5hZ2VyIiwic2Nob29sX2lkIjoyLCJmaXJzdF9uYW1lIjoiRGVubnkiLCJsYXN0X25hbWUiOiJXaGl0Y29tYiJ9.Vyikv330xn8rSBIS4qHaFEb2qyBL4WK342qitBBO8gQ"
        }).should((response) => {
            expect(response.status).to.eq(200);
        });
    });
})