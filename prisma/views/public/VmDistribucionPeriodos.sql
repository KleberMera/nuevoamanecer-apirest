SELECT
  periodo,
  mes,
  totalcobrado,
  totalinteres,
  totalcapital,
  interesporciento,
  interesmenosporciento,
  totalacciones,
  totalaccionesanterior,
  CASE
    WHEN (totalaccionesanterior > 0) THEN (
      interesmenosporciento / (totalaccionesanterior) :: double precision
    )
    ELSE (0) :: double precision
  END AS utilidadporaccion
FROM
  (
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
      COALESCE(sum(dp.monto), (0) :: double precision) AS totalcobrado,
      COALESCE(sum(dp.interes), (0) :: double precision) AS totalinteres,
      COALESCE(sum(dp.capital), (0) :: double precision) AS totalcapital,
      COALESCE(
        (sum(dp.interes) * (0.20) :: double precision),
        (0) :: double precision
      ) AS interesporciento,
      COALESCE(
        (
          sum(dp.interes) - (sum(dp.interes) * (0.20) :: double precision)
        ),
        (0) :: double precision
      ) AS interesmenosporciento,
      (COALESCE(sum(a.numero), (0) :: bigint)) :: integer AS totalacciones,
      lag(
        (COALESCE(sum(a.numero), (0) :: bigint)) :: integer,
        1,
        0
      ) OVER (
        ORDER BY
          dp."periodoPago"
      ) AS totalaccionesanterior
    FROM
      (
        "DetallePrestamo" dp
        LEFT JOIN "Accion" a ON (
          (
            (a.periodo = dp."periodoPago")
            AND (a.estado = 'A' :: text)
          )
        )
      )
    WHERE
      (
        (dp."estadoPago" = 'PAGADO' :: text)
        AND (dp."periodoPago" IS NOT NULL)
      )
    GROUP BY
      dp."periodoPago"
  ) subquery
ORDER BY
  periodo DESC;