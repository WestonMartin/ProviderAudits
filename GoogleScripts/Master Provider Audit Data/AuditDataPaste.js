function UpdateAuditTrackers() {
  var sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tracker-Post'); // Change to your sheet name
  var data = sourceSheet.getDataRange().getValues();
  var folderId = '1vTLWCsbJAaUkydcCB2AutE_J0nc-yvIi'; // Replace with your specific folder ID
  var folder = DriveApp.getFolderById(folderId);

  // Define the columns you want to copy (C, D, E, F)
  var columnsToCopy = [2, 3, 4, 5]; // C, D, E, F are indices 2, 3, 4, 5 respectively

  // Preliminary step: Clear all data from row 2 downwards in every "Audit Tracker" sheet within the folder
  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();
    var spreadsheet = SpreadsheetApp.open(file);
    var sheet = spreadsheet.getSheetByName('Audit Tracker');
    if (sheet) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange('A2:E' + lastRow).clearContent(); // Adjust the column range as needed
      }
    }
  }

  // Aggregate data by PaycomID
  var aggregatedData = {};
  for (var i = 1; i < data.length; i++) { // Start from 1 to skip the header row
    var paycomID = data[i][1]; // PaycomID is in column B (index 1)
    if (!aggregatedData[paycomID]) {
      aggregatedData[paycomID] = [];
    }
    var rowData = columnsToCopy.map(col => data[i][col]);
    aggregatedData[paycomID].push(rowData);
  }

  // Process each unique PaycomID
  for (var paycomID in aggregatedData) {
    var newData = aggregatedData[paycomID];
    var foundFile = null;

    // Iterate over the files in the folder to find the one with the PaycomID in the name
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      if (file.getName().includes(paycomID + '_Audit Tracker')) {
        foundFile = file;
        break;
      }
    }

    if (foundFile) {
      var targetSheet = SpreadsheetApp.open(foundFile);
      var targetSheetSheet = targetSheet.getSheetByName('Audit Tracker');
      if (targetSheetSheet) {
        // Write the data starting from A2
        targetSheetSheet.getRange(2, 1, newData.length, newData[0].length).setValues(newData);
      } else {
        Logger.log('Audit Tracker sheet not found in ' + foundFile.getName());
      }
    } else {
      Logger.log('File with PaycomID ' + paycomID + ' not found.');
    }
  }
}
