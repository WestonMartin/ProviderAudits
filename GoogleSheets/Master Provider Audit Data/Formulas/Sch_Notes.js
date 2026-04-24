//Column B:
=INDEX(IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!M:M"), Match(M2,IMPORTRANGE("1_eur7bGQUseHkUDaq3CB4sPsCUfPfMZcNqSp02kPcxM", "Master Provider Roster!L:L"),0))
//Column C:
=IFS(
G:G="Checked In", "Please complete this note",
G:G="Scheduled", "Please check in or cancel appointment")
//Column D:
=QUERY(Fusion_Master!A:V,"SELECT C, B, G, D, E, F, J, A, L, V WHERE D = 'Scheduled' OR (D = 'Checked In' AND (E = 'Not Started' OR E = 'Draft'))", 1)