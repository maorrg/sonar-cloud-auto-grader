const axios = require('axios');

const sonarProp = {
    hostname: 'https://sonarcloud.io',
    path: '/api/measures/component',
    componentKeyParam: 'componentKey',
    metricKeysParam: 'metricKeys',
    metricKeysValue: 'bugs,vulnerabilities,sqale_rating,sqale_index,code_smells,coverage,test_success_density,sqale_index,security_hotspots',
}


  //https://sonarcloud.io/api/measures/component?componentKey=cs2901-2021-1_lab05-sec01-translator-renatoseb&metricKeys=bugs,security_rating,sqale_rating,sqale_index,code_smells,coverage

module.exports = {

    requestSonarReport : async function (componentKeyValue) {
        const URI = `${sonarProp.hostname}${sonarProp.path}?${sonarProp.componentKeyParam}=${componentKeyValue}&${sonarProp.metricKeysParam}=${sonarProp.metricKeysValue}`;
        const response = await axios.get(URI);
        const metrics = response.data.component.measures;
        return metrics;
    },
    getAndParseFloatValue : function (keyName, array) {
        const keyValue = this.findJsonKey(keyName, array);
        if(keyValue != undefined){
            return parseFloat(keyValue.value);
        }
        return null;
    },
    calculateSonarFactor : function (sonarReport) {
        return (
            sonarReport.coverage > 85 &&
            sonarReport.bugs == 0 &&
            sonarReport.code_smells < 2 &&
            sonarReport.vulnerabilities == 0 &&
            sonarReport.security_hotspots == 0 &&
            sonarReport.maintainability_rating == 1 &&
            sonarReport.technical_debt <= 30
        )
    },
    convertMetric : function (sonarResponse) {
        return {
            coverage : this.getAndParseFloatValue('coverage', sonarResponse),
            test_success_density: this.getAndParseFloatValue('test_success_density', sonarResponse),
            bugs : this.getAndParseFloatValue('bugs', sonarResponse),
            code_smells : this.getAndParseFloatValue('code_smells', sonarResponse),
            vulnerabilities : this.getAndParseFloatValue('vulnerabilities', sonarResponse),
            security_hotspots : this.getAndParseFloatValue('security_hotspots', sonarResponse),
            maintainability_rating : this.getAndParseFloatValue('sqale_rating', sonarResponse),
            technical_debt: this.getAndParseFloatValue('sqale_index', sonarResponse)
        }
    },
    findJsonKey : function (metricKey, array) {
        for (var i=0; i < array.length; i++) {
            if (array[i].metric === metricKey) {
                return array[i];
            }
        }
    },
    calculateFinalSonarReport : async function (projectKey) {
        sonarResponse = await this.requestSonarReport(projectKey);
        convertedMetrics = this.convertMetric(sonarResponse);
        sonarFactor = this.calculateSonarFactor(convertedMetrics);
        convertedMetrics['sonar_factor'] = sonarFactor ? 1 : 0;
        return convertedMetrics;
    }
}
