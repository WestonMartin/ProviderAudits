//Column B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!S:S"),0))
//Column D
=QUERY(Tally_Master!A:R,"SELECT F, B, K, C, G, O, J, M, H, E WHERE A IS NOT NULL", 1)