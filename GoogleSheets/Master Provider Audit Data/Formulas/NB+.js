//Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column C
=IF(AND(OR(D2="Billable, Non"), OR(REGEXMATCH(J2, "^MED_"), REGEXMATCH(J2, "^INS_"), J2="Private Pay")), "Blank", "Please change code to a NB Code")
//Column D
=Query(Fusion_Master!A:V, "SELECT C, B, G, D, E, F, J, A, L, V, H WHERE (E = 'Signed' OR E = 'Charges Submitted') AND C CONTAINS 'Billable, Non'", 1)