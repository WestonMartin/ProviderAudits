function linkFilesToMasterTracker() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Master Tracker"); // Ensure we are working with the "Master Tracker" tab
  var folderId = "1vTLWCsbJAaUkydcCB2AutE_J0nc-yvIi"; // Folder ID where files are stored
  var folder = DriveApp.getFolderById(folderId);

  // Get data from columns A, B, and H
  var paycomIdRange = sheet.getRange("A2:A"); // Column A (PaycomID)
  var columnBRange = sheet.getRange("B2:B"); // Column B (Names or data to link)
  var columnHRange = sheet.getRange("H2:H"); // Column H (Hyperlinks)
  var paycomIds = paycomIdRange.getValues();
  var columnBData = columnBRange.getValues();
  var columnHData = columnHRange.getValues();

  for (var i = 0; i < paycomIds.length; i++) {
    var paycomId = paycomIds[i][0].trim(); // PaycomID from column A
    var dataToLink = columnBData[i][0].trim(); // Data from column B
    var hyperlink = columnHData[i][0].trim(); // Hyperlink in column H

    // Check if column H is blank and column A has data
    if (paycomId && !hyperlink) {
      var files = folder.getFiles();
      var fileFound = false;

      // Search the folder for a file that matches the PaycomID
      while (files.hasNext()) {
        var file = files.next();
        var fileName = file.getName();

        if (fileName.includes(paycomId)) {
          var fileUrl = file.getUrl();

          // Add the data from column B into column H as a hyperlink to the file
          sheet.getRange(i + 2, 8).setFormula('=HYPERLINK("' + fileUrl + '", "' + dataToLink + '")');
          Logger.log('Linked "' + dataToLink + '" to file "' + fileName + '" in row ' + (i + 2));
          fileFound = true;
          break;
        }
      }

      if (!fileFound) {
        Logger.log('No file found for PaycomID "' + paycomId + '" in row ' + (i + 2));
      }
    }
  }
}
