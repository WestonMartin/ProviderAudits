function copyAndSortData() {
  // Define the source and destination sheet names
  var sourceSheetName = 'SourceSheet';
  var destinationSheetName = 'Master Tracker';
  
  // Get the spreadsheet and sheets
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = spreadsheet.getSheetByName(sourceSheetName);
  var destinationSheet = spreadsheet.getSheetByName(destinationSheetName);
  
  // Get the data range from the source sheet, excluding the header
  var sourceRange = sourceSheet.getRange(2, 1, sourceSheet.getLastRow() - 1, 7);
  var sourceValues = sourceRange.getValues();
  
  // Sort the source values alphabetically by the second column (names)
  sourceValues.sort(function(a, b) {
    return a[1].toString().localeCompare(b[1].toString());
  });

  // Get the data and formulas from the destination sheet (Master Tracker) and create a map for data from column 8 onwards
  var destinationRange = destinationSheet.getRange(2, 1, destinationSheet.getLastRow() - 1, destinationSheet.getLastColumn());
  var destinationValues = destinationRange.getValues();
  var destinationFormulas = destinationRange.getFormulas();
  
    // Get the data and formulas from the destination sheet and create a map for columns H:K
  var additionalDataMap = {};
  for (var i = 0; i < destinationValues.length; i++) {
    var paycomID = destinationValues[i][0]; // Column A (Paycom ID)
    
    // Extract exactly columns H:K (8-11)
    var additionalData = destinationValues[i].slice(7, 11);
    var additionalFormulas = destinationFormulas[i].slice(7, 11);

    // Ensure all 4 columns (H:K) exist, padding with empty values if necessary
    while (additionalData.length < 4) additionalData.push(""); 
    while (additionalFormulas.length < 4) additionalFormulas.push("");

    additionalDataMap[paycomID] = { values: additionalData, formulas: additionalFormulas };
  }

  // Clear the destination sheet except headers
  destinationSheet.getRange(2, 1, destinationSheet.getLastRow() - 1, destinationSheet.getLastColumn()).clearContent();
  
  // Copy data from the source sheet to the destination sheet
  destinationSheet.getRange(2, 1, sourceValues.length, sourceValues[0].length).setValues(sourceValues);

      // Map the additional data and formulas back to the new rows in the destination sheet
    for (var j = 0; j < sourceValues.length; j++) {  // Use sourceValues instead
    var paycomID = sourceValues[j][0]; // Column A (Paycom ID)
    if (additionalDataMap[paycomID]) {
    // Loop through each column for H:K (4 columns)
    for (var col = 0; col < 4; col++) {
      var cell = destinationSheet.getRange(j + 2, 8 + col);
      var formula = additionalDataMap[paycomID].formulas[col];
      var value = additionalDataMap[paycomID].values[col];
      if (formula && formula !== "") {
        cell.setFormula(formula);
      } else {
        cell.setValue(value);
        }
      }
    }
  }
}