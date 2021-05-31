const { GoogleSpreadsheet } = require('google-spreadsheet');
const userDatabaseFunctions = require('./userDatabaseFunctions');
const User = require('../models/User');
require('dotenv').config();

const credentials = require('../../client_secret.json');
const spreadSheetId = '1e5R7Q62tsH41Fm6dokl-H2x-mpERNka9UzZNPSbKh4k';

module.exports = {

    accessSpreadsheet : async function () {
        try {
            const doc = new GoogleSpreadsheet(spreadSheetId);
            await doc.useServiceAccountAuth(credentials);
            await doc.loadInfo();
            const sheet = doc.sheetsByIndex[0];
            return sheet;
        } catch(e){
            console.log(e);
        }
    },
    readAllRegisters : async function () {
        try {
            const sheet = await this.accessSpreadsheet();
            const rows = await sheet.getRows();
            rows.forEach( function(row, index, array) {
                const user = new User({
                    code: row.code,
                    names: row.names,
                    lastNames: row.lastNames,
                    birthday: row.birthday,
                });
                userDatabaseFunctions.save(user);
            });
        } catch(e){
            console.log(e);
        }
    }





}
