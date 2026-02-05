SELECT
  dp."periodoPago" AS periodo,
  CASE
    EXTRACT(
      MONTH
      FROM
        to_date(
          (dp."periodoPago" || '01' :: text),
          'YYYYMMDD' :: text
        )
    )
    WHEN 1 THEN 'ENERO' :: text
    WHEN 2 THEN 'FEBRERO' :: text
    WHEN 3 THEN 'MARZO' :: text
    WHEN 4 THEN 'ABRIL' :: text
    WHEN 5 THEN 'MAYO' :: text
    WHEN 6 THEN 'JUNIO' :: text
    WHEN 7 THEN 'JULIO' :: text
    WHEN 8 THEN 'AGOSTO' :: text
    WHEN 9 THEN 'SEPTIEMBRE' :: text
    WHEN 10 THEN 'OCTUBRE' :: text
    WHEN 11 THEN 'NOVIEMBRE' :: text
    WHEN 12 THEN 'DICIEMBRE' :: text
    ELSE NULL :: text
  END AS mes,
  COALESCE(sum(dp.monto), (0) :: double precision) AS totalcuota,
  COALESCE(sum(dp.capital), (0) :: double precision) AS totalcapital,
  COALESCE(sum(dp.interes), (0) :: double precision) AS totalinteres,
  count(DISTINCT p."usuarioId") AS cantidadusuarios
FROM
  (
    "DetallePrestamo" dp
    JOIN "Prestamo" p ON ((dp."prestamoId" = p.id))
  )
WHERE
  (dp."periodoPago" IS NOT NULL)
GROUP BY
  dp."periodoPago"
ORDER BY
  dp."periodoPago" DESC;