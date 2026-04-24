//Colummn B
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column D
=Query('Group Calculations'!A:W, "SELECT C, B, G, H, E, F, J, A, L, V WHERE W = '-' AND (G CONTAINS '92508' OR G CONTAINS '97150' OR G CONTAINS 'GRP')", 1)