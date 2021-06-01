require('dotenv').config();

//Google Spreadsheets Settings
const googleSpreadsheetFunctions = require('./helpers/googleSpeadsheetFunction');

//SonarCloud API
const sonarAPi = require('./helpers/sonarApi');

(async () => {
    const projectKey = 'org.example:lab02-pokemon-go'; 
    const response = await sonarAPi.requestSonarReport(projectKey);
    console.log(sonarAPi.convertMetric(response));
})();
