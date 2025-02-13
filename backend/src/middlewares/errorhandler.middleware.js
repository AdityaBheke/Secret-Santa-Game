export default class customError extends Error{
    constructor(statusCode, errorMessage){
        super(errorMessage);
        this.statusCode = statusCode;
    }
}

export const errorHandler = (err, req, res, next)=>{
    if (err instanceof customError) {
        res.status(err.statusCode).send({success: false, errorCode: err.statusCode, message: err.message});
    } else {
        console.log(err);
        res.status(500).send('Something went wrong!');
    }
}