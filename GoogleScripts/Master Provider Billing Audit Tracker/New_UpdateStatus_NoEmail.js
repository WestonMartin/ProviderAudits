function updateStatus_NoEmail_exactMatch() {
  var masterSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = masterSpreadsheet.getSheetByName("Master Tracker");
  var paycomIds = masterSheet.getRange("A2:A" + masterSheet.getLastRow())
    .getValues()
    .map(r => (r[0] || "").toString().trim());

  var folder = DriveApp.getFolderById("1vTLWCsbJAaUkydcCB2AutE_J0nc-yvIi");
  var files = folder.getFiles();

  var phrasesToMatch = [
    "Please convert or cancel this appointment",
    "Please check in or cancel appointment",
    "Please complete this note"
  ].map(p => p.toLowerCase().trim());

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var filePaycomId = (fileName.split("_")[1] || "").toString().trim();
    Logger.log('Checking file: ' + fileName + ' with Paycom ID: ' + filePaycomId);

    if (!filePaycomId) {
      Logger.log("  -> could not parse PaycomID from filename, skipping");
      continue;
    }

    var spreadsheet = SpreadsheetApp.openById(file.getId());
    var auditSheet = spreadsheet.getSheetByName("Audit Tracker");
    if (!auditSheet) {
      Logger.log('  -> Audit Tracker sheet not found, skipping');
      continue;
    }

    var lastRow = auditSheet.getLastRow();
    var data = [];
    if (lastRow >= 2) {
      data = auditSheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    }

    var hasData = data.some(cell => (cell || "").toString().trim() !== "");
    var hasPhraseMatch = data.some(cell =>
      phrasesToMatch.includes((cell || "").toString().trim().toLowerCase())
    );

    var status = !hasData
      ? "Complete"
      : hasPhraseMatch
      ? "Incomplete Note"
      : "Note Revisions Needed";

    var idx = paycomIds.indexOf(filePaycomId);
    if (idx !== -1) {
      masterSheet.getRange(idx + 2, 11).setValue(status); // column K
      Logger.log("  -> set status for " + filePaycomId + " to " + status);
    } else {
      Logger.log("  -> PaycomID " + filePaycomId + " not found in Master Tracker");
    }
  }
}
