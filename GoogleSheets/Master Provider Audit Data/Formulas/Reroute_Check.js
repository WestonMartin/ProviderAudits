//Column A
=QUERY(
  Fusion_Master!A:V,
  "SELECT C, B, A, F, J 
   WHERE NOT ((F CONTAINS 'Clinic') AND (J CONTAINS 'MED_' OR J CONTAINS 'INS_' OR J CONTAINS 'Private Pay')) 
     AND NOT (C CONTAINS 'Billable, Non' OR C CONTAINS 'Orientation, Administration')",
  1
)
//Column F
=INDEX(RerouteReport!B:B,MATCH(A2,RerouteReport!A:A,0))
//Column G
=IF(F2=D2,"Match","Fix")
//Column H
=IF(F2=E2,"Match","Fix")