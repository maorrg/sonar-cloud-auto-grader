require('dotenv').config();
const { GoogleAPI, google } = require('googleapis');
const credentials = require('../../client_secret.json');

const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);
const spreadSheetId = '10g7npss_XO0wmo6dWkcOLLckzt62GmIxAHFSdGi9au8';


client.authorize(function(err, tokens){
    if(err) console.log(err);
    else {
        console.log('Connected!');
        accessSpreadsheet(client);
    }
});

async function accessSpreadsheet(googleClient){
    const sheetAPI = google.sheets({version:'v4', auth: googleClient});
    const options = {
        spreadsheetId: spreadSheetId,
        range: 'factor_sonar' //sheetName!A1:B2
    }
    let dataResponse = await sheetAPI.spreadsheets.values.get(options);
    const rows = dataResponse.data.values;

    if(rows.length){
        var rowHead = rows.shift();
        rows.forEach(row => {
            console.log(row);
        });
        //sheetAPI.spreadsheets.values.update({
            //https://stackoverflow.com/questions/39125937/update-a-spreadsheet-with-the-google-api
        //});
        //console.log();
    }

    //dataArray.map(function(row){
      //  
    //});
}

