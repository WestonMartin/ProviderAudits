//Column A
=Query(Fusion_Master!A:V, "SELECT * WHERE (D = 'Checked In' OR D = 'Scheduled')", 1)
//Column W
=IF(OR(B2=B1, B2=B3), "MATCH", "-")
//Column X
=IF(AND(C2=C1, OR(B2=B1, B2=B3)), "MATCH", "-")