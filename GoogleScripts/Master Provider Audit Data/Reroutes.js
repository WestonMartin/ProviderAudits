function Reroutes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName("Reroute_Check");
  const targetSheet = ss.getSheetByName("INT_Reroutes");

  // Replacement mapping for D, E, F
  const replacements = {
    "CHE_": "CHE_C",
    "WILCO_": "WILCO_W",
    "FREE_": "FREE_F",
    "COMP_": "COMP_C",
    "ROB_": "ROB_R",
    "MCS_": "MCS_M",
    "LSSD_": "LSSD_L"
  };

  // Get source data
  const sourceValues = sourceSheet.getDataRange().getValues();

  // Headers for INT_Reroutes
  const headers = [
    sourceValues[0][0], // A
    sourceValues[0][3], // D
    sourceValues[0][4], // E
    sourceValues[0][5], // F
    "Reroute to Location",           // formula E
    "Reroute to Payor"            // formula F
  ];

  let seen = new Set();
  let filteredData = [];

  for (let i = 1; i < sourceValues.length; i++) {
    let row = sourceValues[i];
    let colG = row[6];
    let colH = row[7];

    if (colG === "Fix" || colH === "Fix") {
      // Combine A + D for duplicate check
      const key = `${row[0]}|${row[3]}`;
      if (!seen.has(key)) {
        seen.add(key);

        let newRow = [
          row[0],   // A
          row[3],   // D
          row[4],   // E
          row[5]    // F
        ];

        // Apply replacements to D, E, F
        [1, 2, 3].forEach(index => {
          for (let k in replacements) {
            if (newRow[index] && newRow[index].toString().startsWith(k)) {
              newRow[index] = replacements[k];
              break;
            }
          }
        });

        filteredData.push(newRow);
      }
    }
  }

  // Sort by column F (index 3)
  filteredData.sort((a, b) => {
    if (a[3] === b[3]) return 0;
    return a[3] > b[3] ? 1 : -1;
  });

  // Clear destination sheet
  targetSheet.clear();

  // Write headers
  targetSheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Write filtered data
  if (filteredData.length > 0) {
    targetSheet.getRange(2, 1, filteredData.length, filteredData[0].length).setValues(filteredData);

    // Apply formulas dynamically
    // Column E: IF(F = D, "Match","Fix")
    targetSheet.getRange(2, 5, filteredData.length).setFormulaR1C1('=IF(RC[-1]=RC[-3],"Match","Fix")');

    // Column F: IF(D = C, "Match","Fix")
    targetSheet.getRange(2, 6, filteredData.length).setFormulaR1C1('=IF(RC[-2]=RC[-3],"Match","Fix")');
  }
}
