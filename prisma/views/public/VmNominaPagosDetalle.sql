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
  concat(
    u.nombre1,
    ' ',
    COALESCE(u.nombre2, '' :: text),
    ' ',
    u.apellido1,
    ' ',
    COALESCE(u.apellido2, '' :: text)
  ) AS nombrecompleto,
  dp.monto AS cuota,
  dp.capital,
  dp.interes,
  dp."estadoPago" AS estadopago,
  concat(
    (dp."cuotaNum") :: character varying,
    '/',
    (p.cuotas) :: character varying
  ) AS cuotapagar
FROM
  (
    (
      "DetallePrestamo" dp
      JOIN "Prestamo" p ON ((dp."prestamoId" = p.id))
    )
    JOIN "Usuario" u ON ((p."usuarioId" = u.id))
  )
WHERE
  (dp."periodoPago" IS NOT NULL)
ORDER BY
  dp."periodoPago" DESC,
  dp."cuotaNum";