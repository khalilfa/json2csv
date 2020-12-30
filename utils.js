const { Parser } = require('json2csv');
const fs = require('fs');
const { off } = require('process');

const fields = ['Cust_Id__c', 'Name', 'Razon_Social__c', 'N_de_CUIT__c', 'Pa_s__c', 'BillingStreet'
, 'BillingCity', 'BillingPostalCode', 'BillingCountryCode', 'BillingStateCode', 'Unique_Nickname__c'
, 'Estado_del_Vendedor__c', 'Identification_Type__c', 'Identification_Number__c', 'Immediate_Payment__c'
, 'User_Type__c', 'Credit_Consumed__c', 'Credit_Level_Id__c', 'Allowed_to_List__c'
, 'Allowed_to_Sell__c', 'List_Error_Codes__c', 'Sell_Error_Codes__c', 'Tags__c'];

const opts = { fields };

const readFile = (fileName) => {
    try {
        let data = fs.readFileSync(fileName);
        let accounts = JSON.parse(data);

        return accounts;
    } catch (error) {
        throw new Error('-- ERROR: No se pudo leer el archivo: ' + error.message);
    }
};

const createFile = (filePath, data) => {
    fs.writeFile(filePath, data, err => {
        if (err) console.log('\n' + '-- Error al guardar el archivo "' + filePath + '" : ' + err);
        console.log('\n' + 'El archivo "' + filePath + '" se guardo con exito');
    });
};

// Read file
const filePath = process.argv[2];
const resultFilePath = __dirname + '/' + filePath;
const accs = readFile(resultFilePath);
console.log('Cantidad de cuentas en el archivo "' + resultFilePath + '": ' + accs.length + '\n');

// Fragment data
const newAccs = [];
let limit = process.argv[3] || 10000;
while(accs.length != 0){
    newArray = accs.splice(0, limit);
    newAccs.push(newArray);
}

console.log('Cantidad de subArrays: ' + newAccs.length);

// Convert the file
try {
    newAccs.forEach((elems, index) => {
        const parser = new Parser(opts);
        const csv = parser.parse(elems);
        
        // Create a file .csv
        createFile('Respuesta-' + (index + 1) + '.csv', csv);
    });

} catch (err) {
    console.error(err);
}