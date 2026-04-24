//Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column C
=IF(ISNUMBER(SEARCH(LEFT(J2,FIND("_",J2)-1), F2)), "", "School Code does not match Payer")

//Column D
=Query(Fusion_Master!A:V, "SELECT C, B, G, D, E, F, J, A, L, V WHERE (E = 'Signed' OR E = 'Charges Submitted') AND NOT (G CONTAINS '9' OR G CONTAINS 'NB' OR G CONTAINS 'ADM') AND NOT (J CONTAINS 'INS' OR J CONTAINS 'MED' OR J CONTAINS 'Private Pay') AND NOT (I = '$0.00' )", 1)