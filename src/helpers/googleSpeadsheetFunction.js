require('dotenv').config();
const { GoogleAPI, google } = require('googleapis');
const credentials = require('../../client_secret.json');
const sonarApi = require('../helpers/sonarApi');

const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);
const spreadSheetId = '10g7npss_XO0wmo6dWkcOLLckzt62GmIxAHFSdGi9au8';

//coverage : this.getAndParseFloatValue('coverage', sonarResponse),
//            test_success_density: this.getAndParseFloatValue('test_success_density', sonarResponse),
//            bugs : this.getAndParseFloatValue('bugs', sonarResponse),
//            code_smells : this.getAndParseFloatValue('code_smells', sonarResponse),
//            vulnerabilities : this.getAndParseFloatValue('vulnerabilities', sonarResponse),
//            security_hotspots : this.getAndParseFloatValue('security_hotspots', sonarResponse),
//            maintainability_rating : this.getAndParseFloatValue('sqale_rating', sonarResponse),
//            technical_debt: this.getAndParseFloatValue('sqale_index', sonarResponse)

function buildRow(row, sonarReport) {
    console.log(row);
    return [
        ...row.slice(0,6), ...Object.values(sonarReport)
    ]
}


client.authorize(function(err, tokens) {
    if(err) console.log(err);
    else {
        console.log('Connected!');
        accessSpreadsheet(client);
    }
});

async function getSonarResult(rows) {
    const sonarResult = []
    for(let row of rows) {
        const projectKey = row[5];
        const sonarReport = await sonarApi.calculateFinalSonarReport(projectKey);
        sonarResult.push(buildRow(row, sonarReport));
    }
    return sonarResult;
}

async function accessSpreadsheet(googleClient) {
    const sheetAPI = google.sheets({version:'v4', auth: googleClient});
    const options = {
        spreadsheetId: spreadSheetId,
        range: 'factor_sonar' //sheetName!A1:B2
    }
    let dataResponse = await sheetAPI.spreadsheets.values.get(options);
    const rows = dataResponse.data.values;


    if(rows.length){
        var rowHead = rows.shift();
        
        let sonarResult = await getSonarResult(rows);
        console.log(sonarResult);

        //https://stackoverflow.com/questions/39125937/update-a-spreadsheet-with-the-google-api
        sheetAPI.spreadsheets.values.update({
            spreadsheetId: spreadSheetId,
            range: 'factor_sonar!A2:O11',
            valueInputOption: 'RAW',
            resource: {
                majorDimension: 'ROWS',
                values: sonarResult}
            }, (err, resp) => {
                if (err) {
                    console.log('Data Error :', err)
                    reject(err);
                }
        });
    }

    //dataArray.map(function(row){
      //  
    //});
}

