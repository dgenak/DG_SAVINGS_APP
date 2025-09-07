const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'debug.log');

function logError(error) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${error}\n`;
  
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  logError(`Global error: ${event.error}`);
});

process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error}`);
});

module.exports = { logError };