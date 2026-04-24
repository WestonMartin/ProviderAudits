function NoPayorAudit() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Blank Payers");  // main sheet
  
  // 0. Clear old data first
  sheet.getRange("E2:G").clearContent();
  const rerouteSheet = ss.getSheetByName("INT_Blanks");
  if (rerouteSheet) {
    rerouteSheet.getRange("A2:B").clearContent();
  }

  const lastRow = sheet.getLastRow();
  
  // 1. Build column E values (A + "*" + D)
  const colA = sheet.getRange(2,1,lastRow-1,1).getValues();
  const colD = sheet.getRange(2,4,lastRow-1,1).getValues();
  let colE = [];
  for (let i=0; i<colA.length; i++) {
    colE.push([colA[i][0] + "*" + colD[i][0]]);
  }
  sheet.getRange(2,5,colE.length,1).setValues(colE);
  
  // 2. Remove duplicates in column E
  let unique = [...new Set(colE.map(r => r[0]))].map(v => [v]);
  sheet.getRange(2,5,unique.length,1).setValues(unique);
  sheet.getRange(2+unique.length,5,lastRow-unique.length,1).clearContent();
  
  // 3. Split into F & G (Name, Location)
  let splitVals = unique.map(r => r[0].split("*"));
  sheet.getRange(2,6,splitVals.length,2).setValues(splitVals);
  
  // 4. Sort by column G (A-Z)
  sheet.getRange(2,6,splitVals.length,2).sort({column: 7, ascending:true});
  
  // 5. Apply normalization mapping to column G
  const replacements = {
    "CHE_": "CHE_C",
    "WILCO_": "WILCO_W",
    "FREE_": "FREE_F",
    "COMP_": "COMP_C",
    "ROB_": "ROB_R",
    "MCS_": "MCS_M",
    "LSSD_": "LSSD_L"
  };
  
  let colF = sheet.getRange(2,6,splitVals.length,1).getValues(); // F = Name
  let colG = sheet.getRange(2,7,splitVals.length,1).getValues(); // G = Location
  
  for (let i=0;i<colG.length;i++) {
    for (let key in replacements) {
      if (colG[i][0] && colG[i][0].includes(key)) {
        colG[i][0] = replacements[key];
      }
    }
  }
  sheet.getRange(2,7,colG.length,1).setValues(colG);
  
  // 6. Reset conditional formatting for column F duplicates
  let rules = sheet.getConditionalFormatRules();
  rules = rules.filter(rule => {
    const ranges = rule.getRanges().map(r => r.getA1Notation());
    return !ranges.some(r => r.startsWith("F"));
  });
  let newRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=COUNTIF($F:$F,F1)>1')
    .setBackground('#ff9999')
    .setRanges([sheet.getRange("F2:F")])
    .build();
  rules.push(newRule);
  sheet.setConditionalFormatRules(rules);

  // 7. Handle INT_Reroutes
  const blankSheet = ss.getSheetByName("Blank Payers");
  if (rerouteSheet && blankSheet) {
    const lastRowBlank = blankSheet.getLastRow();
    const colFvals = blankSheet.getRange(2,6,lastRowBlank-1,1).getValues(); // F
    const colGvals = blankSheet.getRange(2,7,lastRowBlank-1,1).getValues(); // G
    
    rerouteSheet.getRange(2,1,colFvals.length,1).setValues(colFvals);
    rerouteSheet.getRange(2,2,colGvals.length,1).setValues(colGvals);
  }
}
