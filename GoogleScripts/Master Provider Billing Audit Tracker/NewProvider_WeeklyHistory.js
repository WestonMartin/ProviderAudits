function NewProviders_WeeklyHistory() {
  // Open both spreadsheets
  var providerRosterSS = SpreadsheetApp.openById('1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM');
  var billingAuditSS = SpreadsheetApp.getActiveSpreadsheet(); // Assuming script runs from this spreadsheet

  // Access tabs
  var rosterSheet = providerRosterSS.getSheetByName("Master Provider Roster");
  var auditSheet = billingAuditSS.getSheetByName("Weekly Audit History");

  // Get data from roster
  var rosterData = rosterSheet.getDataRange().getValues();
  var headerOffset = 1; // assumes row 1 is headers

  // Get existing Paycom IDs in Weekly Audit History
  var auditPaycomIDs = auditSheet.getRange("A2:A" + auditSheet.getLastRow()).getValues().flat().filter(id => id !== "");

  // Collect new active providers to add
  var newEntries = [];

  for (var i = headerOffset; i < rosterData.length; i++) {
    var row = rosterData[i];
    var status = row[30]; // AE (index 30, since index starts at 0)
    var paycomId = row[12]; // M (index 12)

    if (status === "Active" && paycomId && !auditPaycomIDs.includes(paycomId)) {
      var name = row[0];    // A
      var colC = row[2];    // C
      var colD = row[3];    // D
      var colAA = row[26];  // AA

      newEntries.push([paycomId, name, colC, colD, colAA]);
    }
  }

  if (newEntries.length > 0) {
    var firstEmptyRow = auditSheet.getLastRow() + 1;
    auditSheet.getRange(firstEmptyRow, 1, newEntries.length, newEntries[0].length).setValues(newEntries);
    Logger.log(newEntries.length + " new providers added.");
  } else {
    Logger.log("No new active providers to add.");
  }
}
