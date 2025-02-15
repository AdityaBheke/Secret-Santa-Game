import fs from 'fs';
import path from 'path';
import customError from '../middlewares/errorhandler.middleware.js';

// Function will read csv and return [ [headers], [Employee_EmailID], [Secret_Child_EmailID], { Employee_EmailID: Employee_Name }]
const getDataFromCsv = (file) => {
    return new Promise((resolve, reject)=>{
    if (!file) {
        return reject(new customError(400, 'Please upload a file'));    //Throw error if file not uploaded
    }
    if (path.extname(file.originalname).toLocaleLowerCase()!=='.csv') {
        if (file.path) {
            fs.unlinkSync(file.path)                                    // delete invalid file
        }
        return reject(new customError(400, 'Please upload a .csv file'))    //Throw error if other than .csv file uploaded
    }

    const readStream = fs.createReadStream(file.path,{encoding: 'utf-8'})
    let buffer = '';
    let isFirstRow = true;

    // Array to store all headers
    let headers = [];
    // Array containing emails of all employees
    const employeeEmails = [];
    // Array containing emails of all secretChildren
    const secretChildEmails = [];
    // For mapping employee in { Employee_EmailID: Employee_Name } format
    const employeeMap = {};

    // Reading every chunk and storing data in related structure so that we don't have to map all data again
    readStream.on('data',(chunk)=>{
        buffer += chunk;
        // Below array contains all rows
        const rows = buffer.split('\n');
        // Handling incomplete rows since data is in form of chunks
        buffer = rows.pop();    //Incomplete row is popped out from 'rows' array and stored in buffer
        rows.forEach((record)=>{
            // Converting row into array of all four values
            const row = record.split(',');  //[Employee_Name, Employee_EmailID, Secret_Child_Name, Secret_Child_EmailID]
            if (isFirstRow) {
                headers = row;  // Storing all headers
                isFirstRow = false;
            }else{
                employeeEmails.push(row[1].trim());    // [ Employee_EmailID ]
                secretChildEmails.push(row[3].trim()); // [ Secret_Child_EmailID ]
                employeeMap[row[1]] = row[0].trim();   // { Employee_EmailID: Employee_Name }
            }
        })
    })
    readStream.on('end', ()=>{
        // Handling last row
        if (buffer) {
            const row = buffer.split(',');
            employeeEmails.push(row[1]);    // [ Employee_EmailID ]
            secretChildEmails.push(row[3]); // [ Secret_Child_EmailID ]
            employeeMap[row[1]] = row[0];   // { Employee_EmailID: Employee_Name }
        }
        
        resolve([headers, employeeEmails, secretChildEmails, employeeMap]);
    });
    readStream.on('error',(err)=>{
        reject(err)
    });

    })
};

const createCsvFromData = (headers, employeeEmails, shuffledChildren, employeeMap, oldFile) => {
    return new Promise((resolve, reject) => {
        // Resolving the path where the new CSV file will be stored
        const newFilePath = path.resolve('public', 'downloads', oldFile.filename);

        // Creating a write stream to the new CSV file
        const writeStream = fs.createWriteStream(newFilePath);

        // Writing the headers to the CSV file
        writeStream.write(headers.join(',') + '\n');

        // Looping through employee emails to generate CSV rows
        employeeEmails.forEach((employee, index) => {
            // Constructing a CSV row with employee and shuffled children details
            const row = employeeMap[employee] + ',' + employee + ',' + employeeMap[shuffledChildren[index]] + ',' + shuffledChildren[index] + '\n';
            writeStream.write(row);
        });

        // Ending the write stream to finish writing
        writeStream.end();

        // Resolving the promise when the write is finished
        writeStream.on('finish', () => {
            resolve(oldFile.filename);
        });

        // Rejecting the promise if an error occurs during writing
        writeStream.on('error', (err) => reject(err));
    });
};


export const assignSecretChild = async (oldFile) => {
    try {
        // Fetching data from the provided CSV file (headers, employee emails, secret child emails, and employee mapping)
        const [headers, employeeEmails, secretChildEmails, employeeMap] = await getDataFromCsv(oldFile);
        
        // Array to track the assigned indexes to avoid duplication
        const assignedIndexes = [];
        
        // Array to store shuffled children emails corresponding to employees
        const shuffledChildren = new Array(employeeEmails.length).fill(null);

        // Function to generate a unique index for assigning secret children
        function getUniqueIndex(originalIndex, currentIndex, arraySize) {
            if (currentIndex == -1) {
                return originalIndex;  // If no match, return the original index
            }
            let newIndex = Math.floor(Math.random() * arraySize);  // Randomly generate a new index
            // Ensure the new index is unique and not the same as the original or current index
            if (newIndex != originalIndex && newIndex != currentIndex && !assignedIndexes.includes(newIndex)) {
                assignedIndexes.push(newIndex);  // Track the new index as assigned
            } else {
                newIndex = getUniqueIndex(originalIndex, currentIndex, arraySize);  // Recursively find a unique index
            }
            return newIndex;
        }

        // Loop through each employee and assign a secret child from the shuffled list
        employeeEmails.forEach((employee, index, originalArray) => {
            const originalIndex = index;
            // Find the current index of the employee's secret child
            const currentIndex = secretChildEmails.findIndex((secretChild) => employee.trim() == secretChild.trim());
            // Get a unique new index for the secret child assignment
            const newIndex = getUniqueIndex(originalIndex, currentIndex, originalArray.length);
            // Assign the new shuffled child email to the employee
            shuffledChildren[originalIndex] = secretChildEmails[newIndex];
        });

        // Create a new CSV file with the assigned secret children data
        const newFile = await createCsvFromData(headers, employeeEmails, shuffledChildren, employeeMap, oldFile);
        
        // Delete the original uploaded file after processing
        fs.unlink(oldFile.path, (err) => {
            if (err) throw err;
        });

        // Return the new file containing the secret child assignments
        return newFile;

    } catch (error) {
        if (fs.existsSync(oldFile.path)) {
          // Delete the original uploaded file after processing
          fs.unlink(oldFile.path, (err) => {
            if (err) throw err;
          });
        }
        // Handle errors and throw a custom error with status code and message
        throw new customError(error.statusCode || 500, error.message || "Error while assigning secret child");
    }
};


export const getDownloadFile = (fileName) => {
    try {
        // Resolving the file path based on the provided file name
        const filePath = path.resolve("public", "downloads", fileName);

        // Check if the file exists at the resolved path
        if (!fs.existsSync(filePath)) {
            // Throw a custom error if the file is not found
            throw new customError(404, 'File not found');
        }

        // Return the file path if the file exists
        return filePath;
    } catch (error) {
        // Handle errors and throw a custom error with status code and message
        throw new customError(error.statusCode || 500, error.errorMessage || error.message || "Error while fetching a file");
    }
};


export const deleteFile = (fileName) => {
    try {
        // Resolving the file path based on the provided file name
        const filePath = path.resolve("public", "downloads", fileName);

        // Check if the file exists at the resolved path
        if (!fs.existsSync(filePath)) {
            // Throw a custom error if the file is not found
            throw new customError(404, 'File not found');
        }

        // Delete the file synchronously
        fs.unlinkSync(filePath);

    } catch (error) {
        // Handle errors and throw a custom error with status code and message
        throw new customError(error.statusCode || 500, error.errorMessage || error.message || "Error while deleting a file");
    }
};
