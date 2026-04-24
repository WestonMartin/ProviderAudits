//Column A
=QUERY(Fusion_Master!A:V, "SELECT C, B, A, F WHERE J = '' AND NOT (C CONTAINS 'Billable, Non' OR C CONTAINS 'Orientation, Administration')", 1)