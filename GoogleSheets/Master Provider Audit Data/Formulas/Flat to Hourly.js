//Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column D
=Query(Fusion_Master!A:V, "SELECT C, B, G, D, E, F, J, A, L, V WHERE (E = 'Signed' OR E = 'Charges Submitted') AND NOT (G CONTAINS '9' OR G CONTAINS 'NB') AND NOT (J CONTAINS 'Private Pay' OR J CONTAINS 'VAL' OR F CONTAINS 'KIPP') AND (I = '$0.00') AND (G CONTAINS 'PT')", 1)