// errorHandler.js

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    return res.status(status).send({
        success: false,
        error: 'Something went wrong',
        message: err.message || 'Internal Server Error'
    });
};

// Handle Uncaught Exceptions
const handleUncaughtExceptions = () => {
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });
};

// Handle Unhandled Promise Rejections
const handleUnhandledRejections = () => {
    process.on('unhandledRejection', (reason, promise) => {
        console.log('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
};

module.exports = {
    errorHandler,
    handleUncaughtExceptions,
    handleUnhandledRejections,
};
