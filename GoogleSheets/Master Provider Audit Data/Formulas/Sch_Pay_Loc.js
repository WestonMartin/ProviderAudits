// Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
// Column C
=IF(I2=J2,"Match","Location on SOAP note does not match student's payor on file.")
//Column D
=Query(Fusion_Master!A:V, "SELECT C, B, G, D, E, F, J, A, L, V WHERE (E = 'Signed' OR E = 'Charges Submitted') AND NOT (F CONTAINS 'Clinic' OR F CONTAINS 'Home' OR J CONTAINS 'INS' OR J CONTAINS 'MED' OR J CONTAINS 'Private Pay') AND NOT C CONTAINS 'Billable, Non'", 1)