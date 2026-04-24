function weeklyAuditHistory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const masterSheet = ss.getSheetByName("Master Tracker");
  const snapshotSheet = ss.getSheetByName("Weekly Audit History");

  const masterData = masterSheet.getDataRange().getValues();
  const snapshotData = snapshotSheet.getDataRange().getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time

  const dateRow = snapshotData[0]; // First row has the dates
  const paycomIDs = snapshotData.map(row => row[0]); // Column A (index 0) has the PaycomIDs

  // Find the column in snapshot sheet that matches today's date
  let dateColIndex = -1;
  for (let col = 1; col < dateRow.length; col++) {
    const cellDate = new Date(dateRow[col]);
    cellDate.setHours(0, 0, 0, 0); // Normalize date
    if (cellDate.getTime() === today.getTime()) {
      dateColIndex = col;
      break;
    }
  }

  if (dateColIndex === -1) {
    SpreadsheetApp.getUi().alert("Today's date not found in the header row of 'Weekly Audit Snapshot'.");
    return;
  }

  // Loop through Master Tracker
  for (let i = 1; i < masterData.length; i++) {
    if (masterData[i][10] === "Incomplete Note") { // Column K = index 10
      const paycomID = masterData[i][0]; // Column A = index 0

      // Find the Paycom ID in snapshot sheet
      const snapshotRowIndex = paycomIDs.findIndex(id => id === paycomID);

      if (snapshotRowIndex !== -1) {
        snapshotSheet.getRange(snapshotRowIndex + 1, dateColIndex + 1).setValue("X");
      }
    }
  }
}
