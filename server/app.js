const fs = require('fs');
const path = require('path');

// Module for parsing incoming HTML form data. (Getting submitted file)
const Busboy = require('busboy');
// Module for executing python script on the server
const {spawn} = require('child_process');

// Server Instance
const express = require('express');
const app = express();

// Connection to Database
const pool = require('./db');

// Path for saving submitted file
const tmpDirectory = path.resolve(__dirname, 'tmp');
// Month Array for convertion
const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Serve static resources like index.html, styles, JavaScript logic
app.use(express.static(path.resolve(__dirname, 'public')));
// Parse form data
app.use(express.urlencoded({extended: false}));

// POST request when user wants to upload a PDF Tax Receipt
app.post('/taxreceipt', async (req, res) => {
    try {
        // Decode QR code & get date from PDF Tax Receipt
        const decodedData = await decodePDFTaxReceipt(req);
    
        // Get the RFC and Date from the python script response
        const data = formatData(decodedData);
    
        // Create new Tax Receipt register in the Database
        await createTaxReceipt(data);
        
        // Insertion was successful
        res.status(200).json({success: true, data: [data]});
    } catch (err) {
        return res.status(500).json({success: false, msg: err})
    }
})

const createTaxReceipt = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log(data);
        const {rfc, date} = data;
        const year = date.split('-')[0];
        const month = date.split('-')[1];
        const result = await pool.query(
            `SELECT * FROM comprobante_fiscal
            WHERE rfc_emisor = 'SUCC961125A15' 
            AND EXTRACT(MONTH FROM fecha_emision) = $1
            AND EXTRACT(YEAR FROM fecha_emision) = $2`,
            [month, year]
        )

        // If the Tax Receipt that has been uploaded already exists sends an error
        // message indicating the full name of the tax receipt owner and tax receipt month
        if(result.rowCount !== 0) {
            const person = await pool.query(
                `SELECT primer_nombre || ' ' || COALESCE(segundo_nombre || ' ', '') 
                || primer_apellido || ' ' || segundo_apellido AS nombre_completo
                FROM persona 
                WHERE rfc = $1`,
                [rfc]
            );
            const fullName = person.rows[0]['nombre_completo'];
            reject(`The Tax Receipt of ${fullName} for Month ${months[Number(month)-1]} Already Exists`);
        }
        
        // If Tax Receipt doesn't exist, create a new register in the Tax Receipt table
        try {
            newTaxReceipt = await pool.query(
                `INSERT INTO comprobante_fiscal (fecha_emision, rfc_emisor) VALUES 
                ($1, $2)`,
                [date, rfc]
            )
            resolve();
        } catch (err) {
            reject("Error Inserting into Database");
        }
    })
}

const decodePDFTaxReceipt = (req) => {
    return new Promise((resolve, reject) => {
        let dataFromPythonScript = [];
        const busboy = new Busboy({ headers: req.headers });
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            busboy.tmpPath = path.join(tmpDirectory, filename);
            // Receives chunk of data, when it receives a chunk of data it is stored in a 
            // new file inside the 'tmp' directory. The new file name is the same as the 
            // uploaded file name
            file.on('data', (data) => {
                fs.writeFileSync(busboy.tmpPath, data, {flag: 'a'});
            });
        });
        // When all the file has been uploaded
        busboy.on('finish', () => {
            console.log('Done parsing form!, Calling Python Script...');
            // Calls python script for decoding the QR Code that is inside the
            // PDF Tax Receipt recently uploaded
            const process = spawn(
                'py',
                [path.resolve(__dirname, 'py', 'readQR.py'), busboy.tmpPath]
                );
            // Receives what 'print' operations print in the python script
            process.stdout.on('data', (data) => {
                dataFromPythonScript.push(data.toString());
            });
            // When Python Script ends
            process.on('close', (code) => {
                if(code !== 0) {
                    reject('Error on Python Script');
                }else {
                    resolve(dataFromPythonScript);
                }
            });
        });
        req.pipe(busboy);
    })
}

const formatData = (dataFromPythonScript) => {
    // Remove blank spaces from the start and end of the string
    const data = dataFromPythonScript[0].trim();

    const startRFC = data.search("&re=");
    const endRFC = data.search("&rr=");
    const rfc = data.substring(startRFC + 4, endRFC);

    const endDate = data.length;
    const date = data.substring(endDate - 10, endDate);

    return {rfc, date};
}

app.listen(5000, () => {
    console.log('Server Listening on port 5000');
})