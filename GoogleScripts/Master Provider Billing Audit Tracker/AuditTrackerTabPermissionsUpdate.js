function auditTrackerTabPermissionsUpdate() {
  const folderId = "1vTLWCsbJAaUkydcCB2AutE_J0nc-yvIi";
  const emailsToAdd = [
    "carissa.baun@projectplaytherapy.com",
    "clientbilling@projectplaytherapy.com"
  ];

  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);

  while (files.hasNext()) {
    const file = files.next();
    const fileId = file.getId();
    const fileName = file.getName();
    
    Logger.log(`Processing file: ${fileName}`);

    try {
      // Step 1: Grant file-level editor access ONLY IF NOT ALREADY GRANTED
      const currentEditors = file.getEditors().map(user => user.getEmail());
      
      emailsToAdd.forEach(email => {
        if (!currentEditors.includes(email)) {
          file.addEditor(email);
          Logger.log(`Added editor access for ${email} to file ${fileName}`);
        } else {
          Logger.log(`${email} already has editor access to file ${fileName}`);
        }
      });

      // Step 2: Open the spreadsheet and access the "Audit Tracker" tab
      const spreadsheet = SpreadsheetApp.openById(fileId);
      const sheet = spreadsheet.getSheetByName("Audit Tracker");
      
      if (!sheet) {
        Logger.log(`Sheet "Audit Tracker" not found in file: ${fileName}`);
        continue;
      }

      // Step 3: Get or create sheet protection
      const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
      let protection = protections.length > 0 ? protections[0] : sheet.protect();

      // Step 4: Add users to sheet-level protection ONLY IF NOT ALREADY ADDED
      const protectionEditors = protection.getEditors().map(user => user.getEmail());

      emailsToAdd.forEach(email => {
        if (!protectionEditors.includes(email)) {
          protection.addEditor(email);
          Logger.log(`Added ${email} as editor to sheet protection on "${fileName}"`);
        } else {
          Logger.log(`${email} already has editor access to sheet protection on "${fileName}"`);
        }
      });

    } catch (err) {
      Logger.log(`Error processing file ${fileName}: ${err.message}`);
    }
  }

  Logger.log("Done updating all files.");
}
