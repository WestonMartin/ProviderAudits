//Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column C
=IF(AND(OR(F2="NB_5", F2="NB_6", F2="NB_7"), OR(REGEXMATCH(J2, "^MED"), REGEXMATCH(J2, "^INS_"), J2="Private Pay")), "Blank", "Please Change Code to a School Code or a Flat Rate Code")
//Column D
=Query(Fusion_Master!A:V, "SELECT C, B, G, D, E, F, J, A, L, V, H WHERE (E = 'Signed' OR E = 'Charges Submitted') AND G CONTAINS 'NB'", 1)