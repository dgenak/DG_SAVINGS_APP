const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'savings-data.json');

function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return { financeData: [], goals: [] };
}

function saveData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

module.exports = { loadData, saveData };