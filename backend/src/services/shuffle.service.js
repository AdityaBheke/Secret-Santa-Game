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

const createCsvFromData = (headers, employeeEmails, shuffledChildren, employeeMap, oldFile)=>{
    return new Promise((resolve, reject)=>{
        const newFilePath = path.resolve('public','downloads', oldFile.filename);
        const writeStream = fs.createWriteStream(newFilePath);
        writeStream.write(headers.join(',')+'\n');
        employeeEmails.forEach((employee, index)=>{
        const row = employeeMap[employee] + ',' + employee + ',' + employeeMap[shuffledChildren[index]] + ',' + shuffledChildren[index] + '\n';
        writeStream.write(row);
        })
        writeStream.end();
        writeStream.on('finish',()=>{
            resolve(oldFile.filename)
        });
        writeStream.on('error',(err)=>reject(err));
    })
};

export const assignSecretChild = async(oldFile) => {
    try {
        
    const [headers, employeeEmails, secretChildEmails, employeeMap] = await getDataFromCsv(oldFile);
    const assignedIndexes = [];
    const shuffledChildren = new Array(employeeEmails.length).fill(null);

    function getUniqueIndex(originalIndex, currentIndex, arraySize){
        if (currentIndex == -1) {
            return originalIndex
        }
        let newIndex = Math.floor(Math.random()*arraySize);
        if (newIndex!=originalIndex && newIndex!=currentIndex && !assignedIndexes.includes(newIndex)) {
            assignedIndexes.push(newIndex);
        } else {
            newIndex = getUniqueIndex(originalIndex, currentIndex, arraySize)
        }
        return newIndex;
    }

    employeeEmails.forEach((employee, index, originalArray)=>{
        const originalIndex = index;
        const currentIndex = secretChildEmails.findIndex((secretChild)=>employee.trim()==secretChild.trim());
        const newIndex = getUniqueIndex(originalIndex, currentIndex, originalArray.length);
        shuffledChildren[originalIndex] = secretChildEmails[newIndex];
    })
    const newFile = await createCsvFromData(headers, employeeEmails, shuffledChildren, employeeMap, oldFile);
    fs.unlink(oldFile.path,(err)=>{
        if (err) throw err;
    })
    return newFile;
    } catch (error) {
        throw new customError(error.statusCode || 500, error.message || "error while assigning secret child")
    }
};

export const getDownloadFile = (fileName)=>{
    try {
      const filePath = path.resolve("public", "downloads", fileName);
      if (!fs.existsSync(filePath)) {
        throw new customError(404, 'File not found')
      }
      return filePath;
    } catch (error) {
        throw new customError(error.statusCode || 500, error.errorMessage || error.message || "error while fetching a file")
    }
}

export const deleteFile = (fileName)=>{
    try {
        const filePath = path.resolve("public", "downloads", fileName);
        console.log("File to delete:", filePath);
        
        if (!fs.existsSync(filePath)) {
            throw new customError(404, 'File not found')
        }
        fs.unlinkSync(filePath);
        console.log('deleted a file')
    } catch (error) {
        throw new customError(error.statusCode || 500, error.errorMessage || error.message || "error while deleting a file")
    }
}