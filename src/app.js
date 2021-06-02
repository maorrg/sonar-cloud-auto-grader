require('dotenv').config();

//Google Spreadsheets Settings
const googleSpreadsheetFunctions = require('./helpers/googleSpeadsheetFunction');

//SonarCloud API
const sonarAPi = require('./helpers/sonarApi');

(async () => {
    const projectKey = 'cs2901-2021-1_lab06-sec02-vaccination-eren-la-gaviota'; 
    const response = await sonarAPi.calculateFinalSonarReport(projectKey);
})();
