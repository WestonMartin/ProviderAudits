function updateStatusAndSendEmails() {
  var masterSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var masterSheet = masterSpreadsheet.getSheetByName("Master Tracker");

  // Read Paycom IDs, Emails, and existing statuses
  var lastRowMaster = masterSheet.getLastRow();
  var paycomIds = masterSheet.getRange("A2:A" + lastRowMaster).getValues().map(r => (r[0] || "").toString().trim());
  var emails = masterSheet.getRange("G2:G" + lastRowMaster).getValues().map(r => (r[0] || "").toString().trim());

  var folder = DriveApp.getFolderById("1vTLWCsbJAaUkydcCB2AutE_J0nc-yvIi");
  var files = folder.getFiles();

  var phrasesToMatch = [
    "Please convert or cancel this appointment",
    "Please check in or cancel appointment",
    "Please complete this note"
  ].map(p => p.toLowerCase().trim());

  var subject = "Audit Updates Required";
  var emailBodyTemplate = "Good Morning!<br><br>" +
    "During our weekly provider note audit, we encountered some edits that require your attention.<br><br>" +
    "Could you please open and make the necessary changes listed on your Audit Tracker ASAP?<br><br>" +
    "Click Here to access your Audit Tracker: <a href=\"[HYPERLINK]\">[FILENAME]</a><br><br>" +
    "All items will stay on your Audit Tracker until the CS Team conducts their next audit review.<br><br>" +
    "If you have any questions or concerns with an item on your list, please respond to this email with the line item included and I will do my best to help answer any of your questions.<br><br>" +
    "Thanks so much for what you do!";

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var filePaycomId = (fileName.split("_")[1] || "").toString().trim();

    Logger.log('Checking file: ' + fileName + ' with Paycom ID: ' + filePaycomId);
    if (!filePaycomId) {
      Logger.log("  -> Could not parse PaycomID from filename, skipping");
      continue;
    }

    var spreadsheet = SpreadsheetApp.openById(file.getId());
    var auditSheet = spreadsheet.getSheetByName("Audit Tracker");
    if (!auditSheet) {
      Logger.log('  -> Audit Tracker sheet not found, skipping');
      continue;
    }

    var lastRowAudit = auditSheet.getLastRow();
    var data = [];
    if (lastRowAudit >= 2) {
      data = auditSheet.getRange(2, 1, lastRowAudit - 1, 1).getValues().flat();
    }

    var hasData = data.some(cell => (cell || "").toString().trim() !== "");
    var hasPhraseMatch = data.some(cell =>
      phrasesToMatch.includes((cell || "").toString().trim().toLowerCase())
    );

    var status = !hasData ? "Complete" : hasPhraseMatch ? "Incomplete Note" : "Note Revisions Needed";

    var idx = paycomIds.indexOf(filePaycomId);
    if (idx !== -1) {
      var statusCell = masterSheet.getRange(idx + 2, 11); // Column K
      statusCell.setValue(status);
      Logger.log("  -> Set status for " + filePaycomId + " to " + status);

      var email = emails[idx];
      if ((status === "Incomplete Note" || status === "Note Revisions Needed") && email) {
        Logger.log('  -> Sending email to: ' + email);
        var emailBody = emailBodyTemplate
          .replace("[HYPERLINK]", file.getUrl())
          .replace("[FILENAME]", fileName);

        GmailApp.sendEmail(email, subject, "", {
          htmlBody: emailBody
        });
      }
    } else {
      Logger.log("  -> PaycomID " + filePaycomId + " not found in Master Tracker");
    }
  }
}
