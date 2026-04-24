//Column A
=QUERY(
    IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!A:AE"),
    "SELECT Col13, Col1, Col2, Col3, Col4, Col18, Col19 
     WHERE Col7 < date '" & TEXT(TODAY(), "yyyy-mm-dd") & "' 
     AND Col3 <> 'Admin' 
     AND NOT Col1 CONTAINS 'Duplicate'
     AND Col3 IS NOT NULL
     AND Col31 CONTAINS 'Active'
     OR 
     ((Col3 = 'Admin') AND Col25 = 'Hourly' AND Col31 CONTAINS 'Active')",
    1
)