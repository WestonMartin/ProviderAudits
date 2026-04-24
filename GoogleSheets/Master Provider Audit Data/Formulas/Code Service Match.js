//Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column C
=IF(ISNUMBER(SEARCH(L2,F2)),"N/A", "Code type does not match service type")
//Column D
=Query(Fusion_Master!A:V, "SELECT C, B, G, D, E, F, J, A, K, V WHERE (E = 'Signed' OR E = 'Charges Submitted') AND (NOT G CONTAINS '9' AND NOT G CONTAINS 'ADM' AND NOT G CONTAINS 'NB' AND NOT G CONTAINS 'NS')", 1)