import { checkSchema, validationResult } from 'express-validator';
import moment from "moment";

import multer from "multer";
import csvParser from "csv-parser"
import fs from "fs";
const upload = multer({ dest: "../controller/uploads/" });


const transactionSchema = {
    Date: {
        in: ['body'],
        errorMessage: 'Invalid date format or date is in the future',
        custom: {
            options: (value) => {
                if (!moment(value, 'DD-MM-YYYY', true).isValid()) {
                    return false;
                }
                const today = moment().startOf('day');
                const transactionDate = moment(value, 'DD-MM-YYYY');
                return transactionDate.isSameOrBefore(today);
            },
        },
    },
    Description: {
        in: ['body'],
        errorMessage: 'Description cannot be empty',
        isLength: {
            options: { min: 1 },
        },
    },
    Amount: {
        in: ['body'],
        errorMessage: 'Amount must be a positive number greater than zero',
        custom: {
            options: (value) => {
                return parseFloat(value) > 0;
            },
        },
    },
    Currency: {
        in: ['body'],
        errorMessage: 'Invalid currency code',
        isAlpha: {
            errorMessage: 'Currency code must only contain letters',
        },
        isLength: {
            options: { min: 3, max: 3 },
            errorMessage: 'Currency code must be 3 characters long',
        },
    },
};

const validateRow = (req,res,next) => {
    
    const filePath = req.file.path;
    
    let result = { isValid: true, message: "" };
    
    fs.createReadStream(filePath)
        .pipe(csvParser({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '') // Handle BOM
        }))
        .on("data", async (row) => {
            
            const req = {
                body: row
            };
            
            await Promise.all(checkSchema(transactionSchema).map(validation => validation.run(req)));
            const { errors } = validationResult(req);
            if (errors.length) {
                result = { isValid: false, message: errors[0].msg };
            }
        })
        .on("end", async () => { 
            
            if (result.isValid) {
                next();
            }
            else {
                return res.status(400).json({ status: "Validation Failed", message: result.message });
            }
            
        })
    
};
  

const validateTransaction = checkSchema(transactionSchema);


function handleValidationError (req, res, next) {

    const { errors } = validationResult(req);

    if (errors.length) {
        return res.status(400).json({status: "Validation Failed",message:errors[0].msg});
    }
    next();
}

export   {validateRow, validateTransaction, handleValidationError };