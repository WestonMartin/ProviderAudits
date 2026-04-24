function createBillingAuditTrackers() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Master Tracker"); // Ensure we are working with the "Master Tracker" tab
  var nameRange = sheet.getRange("B2:B"); // Names are in column B starting from row 2
  var paycomIdRange = sheet.getRange("A2:A"); // Paycom IDs are in column A starting from row 2
  var emailRange = sheet.getRange("G2:G"); // Emails are in column G starting from row 2
  var names = nameRange.getValues();
  var paycomIds = paycomIdRange.getValues();
  var emails = emailRange.getValues();

  var folderId = "1vTLWCsbJAaUkydcCB2AutE_J0nc-yvIi"; // Replace with the actual folder ID
  var templateId = "1A4ZUxdycOjrh7lW4x2Rj8xsiXJeizHn2C-RY9yD_QTw"; // Replace with the actual template sheet ID
  var folder = DriveApp.getFolderById(folderId);

  for (var i = 0; i < names.length; i++) {
    var name = names[i][0].trim();
    var paycomId = paycomIds[i][0].trim();
    var email = emails[i][0].trim(); // Get the corresponding email from column G and remove any leading/trailing spaces

    // Check if all fields are non-empty and the email has a valid format
    if (name && paycomId && email) {
      var fileNamePattern = paycomId + "_Audit Tracker"; // Pattern to search for

      // Check if a file with the same PaycomID already exists in the folder
      var existingFiles = folder.getFiles();
      var fileExists = false;

      while (existingFiles.hasNext()) {
        var existingFile = existingFiles.next();
        var existingFileName = existingFile.getName();
        var existingPaycomId = existingFileName.split("_")[1]; // Extract PaycomID from file name

        if (existingPaycomId === paycomId) {
          fileExists = true;
          break;
        }
      }

      if (fileExists) {
        Logger.log('File with PaycomID "' + paycomId + '" already exists. Skipping creation.');
      } else {
        // Copy the template
        var templateFile = DriveApp.getFileById(templateId);
        var newFile = templateFile.makeCopy(name + "_" + paycomId + "_Audit Tracker", folder);

        // Get the URL of the new file
        var fileUrl = newFile.getUrl();

        // Add the hyperlink to the sheet in column H
        sheet.getRange(i + 2, 8).setFormula('=HYPERLINK("' + fileUrl + '", "' + name + '")');

        try {
          // Share the file with the email address in column G as a editor
          newFile.addEditors([email]); // Pass email as an array
        } catch (e) {
          Logger.log('Failed to add editor for email: ' + email + ' due to error: ' + e.message);
        }
      }
    } else {
      Logger.log('Skipping row ' + (i + 2) + ' due to missing data.');
    }
  }
}
