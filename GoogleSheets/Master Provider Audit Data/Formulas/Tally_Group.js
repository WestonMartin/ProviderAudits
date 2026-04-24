//Column W
=IF(OR(B2=B1, B2=B3), "MATCH", "-")
//Column X
=IF(AND(H2=H1, OR(B2=B1, B2=B3)), "MATCH", "-")