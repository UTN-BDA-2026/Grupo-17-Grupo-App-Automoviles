
# Manual Experto para la Recomendación de Vehículos

Este documento contiene reglas, criterios y conocimiento experto para recomendar vehículos a usuarios en el mercado automotor (con foco en Argentina). Cada sección está escrita de forma autocontenida para ser consultada por un agente de IA mediante búsqueda semántica. Los criterios hacen referencia explícita a los campos disponibles en la base de datos de vehículos: `price`, `currency`, `mileage`, `color`, `fuel_type`, `doors`, `people_capacity`, `condition`, `direction`, `transmission`, `traction_control`, `engine`, `body_type`, `sole_owner`, `vehicle.year`, `vehicle.version`, `vehicle.model.name`, `vehicle.model.brand.name`, y el objeto `equipment` con sus subgrupos (`security`, `confort`, `interior`, `exterior`, `entertainment`, `performance`, `warranty_and_conditions`, `other_features`).

---

## 1. Principios generales de una buena recomendación

Una recomendación efectiva de vehículo nunca se basa en un único atributo. Siempre se cruza al menos tres dimensiones: **necesidad de uso** (urbano, ruta, trabajo, familia), **presupuesto disponible** (campo `price` y `currency`) y **costo total de propiedad** (consumo, repuestos, seguro, patente). Un auto barato de comprar puede ser caro de mantener, y viceversa.

La regla de oro es: el mejor auto no es el más nuevo, ni el más caro, ni el de mayor equipamiento, sino **aquel cuyo perfil de uso y costos coincide con el estilo de vida del comprador**. Antes de recomendar, el agente debe inferir o preguntar: para qué se va a usar el auto, cuántos kilómetros se recorren por mes, cuántas personas lo van a ocupar habitualmente, dónde se estaciona, y qué presupuesto total (compra + mantenimiento anual) se maneja.

Una recomendación honesta también incluye **descartes**: explicar por qué cierto vehículo NO conviene para el caso del usuario es tan valioso como destacar el adecuado. Si todas las opciones disponibles tienen defectos serios, hay que decirlo.

---

## 2. Perfilado del comprador: preguntas clave antes de recomendar

Antes de filtrar la base, conviene clarificar el perfil. Las preguntas que más definen una recomendación son:

- **Uso principal**: ciudad, ruta, mixto, trabajo (reparto, viajes laborales), todoterreno, ocasional.
- **Composición del grupo**: cantidad de pasajeros habituales (mapea con `people_capacity`), si hay niños pequeños (requiere puertas traseras y espacio para sillas de auto), si transporta adultos mayores con movilidad reducida.
- **Kilometraje mensual estimado**: define cuánto pesa el consumo y el `fuel_type` en la decisión.
- **Presupuesto total**: distinguir entre presupuesto de compra (`price`) y presupuesto mensual disponible para combustible, seguro, patente y service.
- **Experiencia del conductor**: principiante, intermedio o experimentado (define si conviene `transmission` Automática o Manual, y si conviene caja chica o mediana).
- **Lugar de estacionamiento**: garage cubierto, calle, cochera ajustada (define `body_type` y largo del vehículo según `equipment.performance.length_height_width`).
- **Tolerancia a riesgo mecánico**: comprador que quiere "subir y andar" debe ir a `condition` 0km o usados con bajo `mileage` y `warranty_and_conditions.factory_warranty` o `mechanical_warranty` activa.

---

## 3. Recomendación por tipo de uso: ciudad

Para uso **urbano predominante**, los criterios prioritarios son maniobrabilidad, consumo, facilidad de estacionamiento y costo de mantenimiento. El `body_type` recomendado es Hatchback, City Car o Sedán compacto. Evitar SUV grandes, Pickups y Minivans salvo necesidad real de espacio.

La `transmission` Automática (CVT, DSG o convencional) es claramente preferible en ciudad por el tráfico denso y los semáforos frecuentes, aunque encarece el precio y el service. La `direction` Eléctrica o Asistida es virtualmente indispensable para estacionar en paralelo.

El `engine` ideal está entre 1.0 y 1.6 litros; cilindradas mayores en ciudad son derroche de combustible. El `fuel_type` Nafta es lo más práctico; el Diésel solo se justifica en ciudad si se recorren más de 30.000 km anuales (su ventaja de consumo no compensa el sobreprecio en uso bajo). GNC es excelente económicamente pero quita capacidad de baúl y exige revisión periódica del cilindro.

El `mileage` aceptable para un auto urbano usado es relativamente más alto que para uno de ruta, porque los kilómetros de ciudad desgastan más embrague y frenos pero menos motor. Aun así, evitar unidades con más de 20.000 km/año en promedio (`mileage` / antigüedad del `vehicle.year`).

Equipamiento crítico para ciudad dentro de `equipment.security`: `parking_sensor` y `backup_camera` simplifican enormemente la vida; `abs_brakes` es no negociable.

---

## 4. Recomendación por tipo de uso: ruta y viajes largos

Para uso **predominante en ruta**, los criterios cambian: priorizar estabilidad, potencia para sobrepasos, comodidad de asientos y consumo en velocidad crucero. El `body_type` ideal es Sedán mediano/grande, SUV o Station Wagon. Los City Car y Hatchback chicos de menos de 1.4 litros sufren en ruta cargados.

El `engine` recomendado va de 1.6 a 2.0 litros para uso mixto, y de 2.0 en adelante para ruta intensiva con carga. La `traction_control` Delantera es suficiente para asfalto; la 4x4 o Integral solo aporta valor si hay caminos de ripio, nieve o lluvia intensa frecuente.

El `fuel_type` Diésel se vuelve muy conveniente cuando se hacen más de 25.000 km anuales, principalmente en ruta: rinde típicamente 30-40% más que un nafta equivalente y los motores diésel modernos duran más en kilometraje sostenido. El GNC también es atractivo en ruta por costo, pero verificar autonomía total con tubo lleno y reserva de nafta.

Para ruta, el `mileage` debe analizarse con más cuidado: un auto con `mileage` alto pero usado mayormente en ruta sufre menos desgaste que uno con menor kilometraje pero todo urbano. Si es posible, preguntar al vendedor el tipo de uso previo.

Equipamiento crítico para ruta: `equipment.security.stability_control` (control de estabilidad), `equipment.security.abs_brakes`, `equipment.confort.air_conditioner`, `equipment.security.airbag_for_driver_and_passenger` como mínimo, idealmente con airbags laterales y de cortina. La `equipment.performance.tank_capacity` también importa: tanques menores a 45 litros obligan a parar muy seguido.

---

## 5. Recomendación por tipo de uso: trabajo y comercial

Para uso **comercial o laboral** (reparto, viajantes, profesionales que recorren mucho), prevalecen durabilidad, costo bajo de repuestos y disponibilidad del servicio técnico. Marcas con red de service amplia en Argentina como Toyota, Volkswagen, Ford, Chevrolet, Renault, Peugeot, Fiat y Nissan son prioridad sobre marcas premium o con menor penetración.

El `body_type` depende del rubro: Pickup para transporte de carga o construcción, Furgón/Utilitario para reparto urbano, Sedán o Hatchback para viajantes. El `condition` Usado con `mileage` moderado y `warranty_and_conditions.mechanical_warranty` activa suele ser la mejor relación costo/beneficio, ya que un 0km pierde valor rápido y un usado muy viejo da problemas.

Para uso comercial intensivo, el `fuel_type` Diésel es casi siempre la elección racional por consumo y torque. El `engine` debe ser proporcional a la carga habitual; un motor chico exigido se rompe antes que uno mediano trabajando a media máquina.

Verificar siempre `sole_owner` (idealmente true) y pedir historial de servicios. Un vehículo comercial con múltiples dueños previos suele haber sido sobreexigido.

---

## 6. Recomendación por composición familiar: pareja sin hijos o single

Para una persona sola o pareja sin hijos, las restricciones de espacio son mínimas y el énfasis suele estar en estilo, performance o eficiencia. `people_capacity` de 4 o 5 es más que suficiente; `doors` puede ser 2, 3 o 5 sin problema. El `body_type` puede ser Coupé, Cabriolet, Hatchback deportivo, Sedán o cualquier variante según gusto.

Si la prioridad es economía pura (estudiante, primer auto, ingreso bajo), enfocar en City Car o Hatchback básico, `engine` 1.0 a 1.4, `transmission` Manual (más barata de comprar y mantener), `fuel_type` Nafta. Modelos típicos: Fiat Mobi, Volkswagen Up!, Renault Kwid, Chevrolet Onix LT, Toyota Etios base, Fiat Cronos básico.

Si la prioridad es disfrute o estilo, ampliar a Coupé, Hatchback turbo, Sedán con buen equipamiento. Aquí el `equipment.entertainment` y el `equipment.interior` (tapizado de cuero) ganan peso en la decisión.

---

## 7. Recomendación por composición familiar: familia con hijos pequeños

Para familias con uno o dos niños pequeños, los requisitos no negociables son: `doors` igual a 4 o 5 (las dos puertas hacen impracticable subir/bajar sillas de bebé), `people_capacity` de al menos 5, y baúl con capacidad real para coche, valijas y compras.

El `body_type` recomendado en orden de preferencia: SUV compacto/mediano (altura facilita subir niños y sillas), Sedán mediano, Station Wagon, Minivan, Hatchback grande. Un Hatchback chico funciona pero queda justo.

Seguridad es prioridad absoluta. Filtrar por `equipment.security.abs_brakes` true, `equipment.security.airbag_for_driver_and_passenger` true, idealmente `equipment.security.stability_control` true. Para `vehicle.year` modernos (2015 en adelante en Argentina) estos elementos son estándar; en años anteriores hay que verificar uno por uno. Sumar `equipment.security.parking_sensor` y `equipment.security.backup_camera` mejora muchísimo la operación diaria.

La `transmission` Automática es muy recomendable para familias por la cantidad de paradas, semáforos y maniobras de estacionamiento con niños distrayendo. La `direction` Eléctrica o Asistida también suma.

El `equipment.confort.air_conditioner` es no negociable con niños. Verificar también `equipment.security.central_door_locking` y, si existe, traba de seguridad infantil en puertas traseras.

---

## 8. Recomendación por composición familiar: familia numerosa o grupos grandes

Cuando hay tres o más hijos, o se transporta habitualmente a más de cinco personas, la única respuesta correcta es un vehículo con `people_capacity` de 7 o más. Las opciones son Minivan (Chevrolet Spin, Toyota Sienna, Citroën Berlingo Patagónica, Peugeot Partner Patagonica) o SUV grande con tercera fila (Toyota SW4, Chevrolet Trailblazer, Ford Everest, Mitsubishi Outlander).

El `body_type` Sedán o Hatchback queda descartado; aunque digan `people_capacity` 5, no son cómodos con tres asientos infantiles atrás. Un Sedán grande sirve solo si la tercera fila no es necesaria habitualmente y los ocupantes son adultos delgados.

El `engine` debe ser de al menos 1.6 a 2.0 para no sufrir con la carga. Cilindrada inferior a 1.4 en un vehículo de 7 plazas es directamente desaconsejable en ruta o en pendientes.

Verificar el `equipment.performance.wheelbase` (distancia entre ejes): a mayor distancia entre ejes, más espacio interior y mejor estabilidad. Tampoco descuidar `equipment.performance.tank_capacity`: con vehículo cargado el consumo sube, y un tanque chico obliga a paradas constantes.

---

## 9. Recomendación por composición familiar: adultos mayores

Para adultos mayores o personas con movilidad reducida, la prioridad es facilidad de acceso. El `body_type` ideal es SUV compacto o crossover: la altura del asiento permite entrar y salir sin agacharse ni hacer fuerza con la cadera. Sedanes bajos y Coupés deportivos son la peor opción.

Otros criterios clave: `doors` igual a 4 (las puertas anchas y de fácil apertura son fundamentales), `transmission` Automática obligatoria (la rodilla izquierda con embrague es un problema frecuente en adultos mayores), `direction` Eléctrica obligatoria (volante liviano).

Equipamiento que mejora la experiencia: `equipment.security.parking_sensor`, `equipment.security.backup_camera`, `equipment.confort.electric_windows`, `equipment.security.central_door_locking`, asientos altos con buena visibilidad. Pedales bien ubicados y panel claro también ayudan, aunque no figuren como campos del JSON.

---

## 10. Recomendación por presupuesto: bajo (hasta ARS 8.000.000 al 2025)

En el rango bajo del mercado argentino, las opciones se concentran en usados de varios años, City Cars básicos, y modelos discontinuados. Hay que ser muy claro con el comprador: en este rango, **el costo de mantenimiento puede igualar o superar el ahorro inicial** si se elige mal.

Buscar marcas con repuestos abundantes y baratos: Volkswagen (Gol, Voyage), Chevrolet (Corsa, Classic, Aveo), Ford (Ka, Fiesta), Fiat (Palio, Siena, Uno), Renault (Clio, Logan, Sandero), Peugeot 207/208 base. Evitar marcas con repuestos importados caros o talleres oficiales reducidos en este rango.

Filtrar agresivamente por `mileage`: para autos del rango 2008-2014, descartar por encima de 180.000 km. Para autos posteriores a 2015, descartar por encima de 130.000 km. Priorizar `sole_owner` true cuando esté disponible.

Verificar `equipment.security.abs_brakes` y `equipment.security.driver_airbag` o `airbag_for_driver_and_passenger`. En autos muy básicos pre-2014 estos no son estándar y se transforma en un descarte serio si el uso será frecuente o familiar.

---

## 11. Recomendación por presupuesto: medio (ARS 8.000.000 a 20.000.000 al 2025)

El rango medio es el más interesante porque ofrece muy buenas opciones tanto en 0km básico como en usados de 3 a 7 años bien equipados. La decisión clave es: **usado más nuevo y equipado, o 0km básico**.

Para uso intensivo o comprador que prioriza tranquilidad, el 0km básico con `warranty_and_conditions.factory_warranty` true gana, aunque tenga menos equipamiento. Para uso normal o conductor experimentado, un usado de 3-5 años de un modelo de gama media-alta con `mileage` bajo y `equipment` completo entrega mucho más auto por el mismo precio.

En este rango aparecen Sedanes y SUV compactos con buen equipamiento: Volkswagen Polo, Chevrolet Onix, Fiat Cronos, Toyota Yaris, Renault Logan, Peugeot 208, Nissan Versa, Ford EcoSport, Volkswagen T-Cross (usado), Chevrolet Tracker (usado), Renault Duster, Citroën C4 Cactus.

Aquí se justifica priorizar `transmission` Automática, `equipment.security.stability_control` y `equipment.security` con múltiples airbags (frontales más laterales).

---

## 12. Recomendación por presupuesto: alto (más de ARS 20.000.000 al 2025)

En el rango alto, el comprador puede elegir entre 0km de gama media/alta o usados premium. La decisión debe considerar la depreciación: un 0km premium pierde 20-25% el primer año; un usado premium de 2-3 años está en su mejor punto de relación calidad/precio/depreciación.

Marcas relevantes en este rango: Toyota Corolla/Hilux/SW4, Volkswagen Vento/Amarok/Tiguan, Chevrolet Cruze/Tracker/S10, Ford Ranger/Territory, Jeep Compass/Renegade, Audi A3/A4 (usados), BMW Serie 1/3 (usados), Mercedes-Benz Clase A/C (usados), Volvo XC40 (usado).

Cuidado con vehículos premium europeos usados sin historial de servicio: los repuestos y la mano de obra cuestan entre 3 y 5 veces más que en una marca masiva. Si `sole_owner` es false y no se puede acceder al historial completo, considerar descartar.

En este rango, equipamiento esperable: `equipment.interior.leather_upholstery`, `equipment.security.backup_camera`, `equipment.exterior.alloy_wheels`, `equipment.security.parking_sensor`, `equipment.confort` completo, `equipment.entertainment.bluetooth` y `usb_input` como mínimo. Si faltan, el vehículo está sobrevalorado para el rango.

---

## 13. Análisis del kilometraje (campo `mileage`)

El `mileage` es uno de los indicadores más importantes en un usado, pero debe interpretarse junto con el `vehicle.year`. La métrica útil es el promedio anual: `mileage / (año_actual - vehicle.year)`.

- **Bajo**: menos de 10.000 km/año. Auto poco usado, probablemente bien cuidado, pero verificar que no haya estado parado mucho tiempo (juntas resecas, batería rota, neumáticos cuarteados).
- **Normal**: entre 10.000 y 20.000 km/año. Rango sano, uso típico particular.
- **Alto**: entre 20.000 y 30.000 km/año. Probable uso laboral o de viajante. No es malo en sí, pero exige verificar service al día y estado mecánico.
- **Muy alto**: más de 30.000 km/año. Casi seguro uso comercial intensivo (Uber, remís, reparto). Aceptable solo con descuento significativo en `price` y `mechanical_warranty` o revisión preventiva exhaustiva.

Casos especiales a flaggear como sospechosos: `mileage` extremadamente bajo en un auto de más de 8 años (posible adulteración del cuentakilómetros) o `mileage` que no condice con el desgaste visible en imágenes (volante gastado, asiento del conductor hundido, pedales pulidos en un auto que dice tener 40.000 km).

---

## 14. Análisis del año del vehículo (`vehicle.year`)

La antigüedad del vehículo (`vehicle.year`) impacta en seguridad, garantía, eficiencia y disponibilidad de repuestos.

- **0km o hasta 2 años**: máxima tranquilidad, garantía de fábrica vigente (`warranty_and_conditions.factory_warranty`). Mayor precio y mayor depreciación inicial.
- **3 a 6 años**: punto dulce. Tecnología moderna, depreciación inicial ya absorbida por el dueño anterior, repuestos plenamente disponibles. Es el rango ideal para la mayoría de los compradores racionales.
- **7 a 10 años**: aún viable si el `mileage` es moderado y hay buen historial. Pueden empezar a fallar componentes electrónicos y de confort. Verificar `equipment.security` porque tecnologías como `stability_control` no eran estándar en gamas bajas pre-2015 en Argentina.
- **Más de 10 años**: solo recomendable si el `price` es muy bajo, el comprador acepta el riesgo y el vehículo será de uso secundario o de iniciación. Las normas de seguridad y emisiones son antiguas; muchos modelos no tienen airbags duales ni ABS.
- **Más de 15 años**: prácticamente solo para fines específicos (auto de iniciación para conductor nuevo, segundo auto de bajo uso, restauración). Costo de mantenimiento puede ser muy alto en autos viejos con electrónica europea.

---

## 15. Tipo de combustible (`fuel_type`)

El `fuel_type` define en gran medida el costo operativo del vehículo. Las opciones más comunes son Nafta, Diésel, GNC, Híbrido y Eléctrico.

- **Nafta**: opción más versátil y mayoritaria. Servicio en todas partes, repuestos baratos, motores más baratos de reparar. Mayor consumo que diésel pero menor costo de mantenimiento.
- **Diésel**: ventajoso si se recorren más de 25.000 km anuales, principalmente en ruta. Mayor torque (ideal para carga y subir pendientes), mayor durabilidad del motor, pero service más caro, inyectores sensibles a mala calidad de combustible y precio inicial más alto.
- **GNC**: el más económico por kilómetro en Argentina, pero ocupa baúl, exige revisión de cilindro cada 5 años (oblea VTV específica), y no todas las marcas garantizan motores con GNC original. Conviene cuando el ahorro de combustible se amortiza en 1-2 años de uso intensivo.
- **Híbrido**: combina motor nafta con eléctrico, recuperando energía en frenadas. Muy eficiente en ciudad (Toyota Corolla Cross HV, Toyota Prius, Ford Kuga HEV). Precio inicial elevado y reparación de batería costosa pero infrecuente.
- **Eléctrico**: cero emisiones locales, costo por kilómetro mínimo, pero infraestructura de carga aún limitada en Argentina fuera de grandes ciudades. Considerar `equipment.other_features.battery_capacity`, `battery_life` y `charging_time`. Revisar disponibilidad de cargadores en la zona del comprador antes de recomendar.

---

## 16. Tipo de transmisión (`transmission`)

La elección entre `transmission` Manual y Automática (incluyendo CVT, DSG, doble embrague) depende del uso, experiencia y presupuesto.

- **Manual**: más barata de comprar, más barata de reparar, mayor control en ruta y nieve, ligeramente menor consumo en uso experto. Cansadora en tráfico urbano denso. Embrague desgastable (cambio cada 80.000-150.000 km). Conviene a: conductores experimentados, usos de bajo tráfico, presupuestos ajustados.
- **Automática convencional (caja con torque converter)**: muy cómoda y robusta, levemente mayor consumo. Reparación costosa pero infrecuente si se hace service. Conviene a: uso urbano intensivo, conductores que valoran confort, familias.
- **Automática CVT**: muy eficiente en consumo, suave, pero algunos modelos tuvieron problemas de durabilidad histórica. Marcas como Toyota y Honda tienen CVT muy confiables.
- **Automática DSG / doble embrague**: respuesta deportiva y eficiente, pero más sensible mecánicamente; pedir historial de service en usados Volkswagen, Audi, Ford con esta caja.

Para principiantes en gran ciudad, automática es claramente recomendable. Para enseñar a manejar en familia o para uso rural/agropecuario, manual sigue siendo válida.

---

## 17. Tipo de carrocería (`body_type`)

El `body_type` define el carácter y la idoneidad del vehículo:

- **Hatchback**: compacto, ágil, ideal urbano, baúl práctico (asientos rebatibles). Mejor relación espacio/largo. Modelos: VW Polo, Chevrolet Onix, Toyota Yaris.
- **Sedán**: baúl separado más grande y seguro, mejor aerodinámica y silencio en ruta. Más largo, ocupa más al estacionar. Modelos: Toyota Corolla, VW Vento, Chevrolet Cruze.
- **SUV compacto / Crossover**: altura útil, manejo más alto, sensación de seguridad, espacio familiar. Mayor consumo que un sedán equivalente. Modelos: VW T-Cross, Chevrolet Tracker, Ford EcoSport.
- **SUV grande / 4x4**: capacidad off-road real (con `traction_control` 4x4 o Integral), espacio para 7 personas en muchos modelos, alta `equipment.performance.tank_capacity`. Consumo elevado, difícil estacionamiento urbano. Modelos: Toyota SW4, Ford Everest, Jeep Grand Cherokee.
- **Pickup**: para carga, trabajo, terrenos difíciles. Caja de carga (no `people_capacity` extra). Excelente reventa en Argentina. Modelos: Toyota Hilux, VW Amarok, Ford Ranger, Chevrolet S10.
- **Coupé**: dos puertas, estilo deportivo, sacrifica practicidad. Pasajeros traseros incómodos. Solo recomendable como segundo auto o para solteros/parejas sin hijos.
- **Cabriolet / Convertible**: nicho. Considerar solo si el comprador lo pide explícitamente; tiene desventajas de seguridad, espacio y mantenimiento de capota.
- **Minivan / Monovolumen**: máximo espacio interior para 7 personas con confort real. Estética divisiva pero funcionalidad imbatible para familias numerosas.
- **Station Wagon / Familiar**: rendimiento de sedán con baúl gigante. Subutilizado en Argentina pero excelente para familias que viajan mucho.

---

## 18. Tracción (`traction_control`)

El campo `traction_control` indica qué ruedas reciben fuerza del motor:

- **Delantera**: la más común en autos de calle. Buena en lluvia normal, eficiente, barata de reparar. Suficiente para más del 90% de los usuarios urbanos y de ruta.
- **Trasera**: típica de algunos Sedanes premium, deportivos y Pickups. Mejor distribución de peso para conducción deportiva, pero peor en lluvia y nieve si no hay control electrónico.
- **4x4 / Integral / Total**: tracción a las cuatro ruedas. Indispensable para ripio, nieve, barro, terrenos difíciles. Excesiva y costosa para uso 100% urbano: mayor consumo, mayor mantenimiento, mayor precio inicial. Hay dos variantes: 4x4 conectable (Pickups, SUVs verdaderos) y AWD/Integral permanente (SUVs modernos, autos premium).

Recomendar 4x4 solo si el usuario explicita uso off-road, vive en zona con nieve frecuente (Bariloche, Esquel, alta montaña), o tiene actividad rural/agro.

---

## 19. Equipamiento de seguridad (`equipment.security`)

La seguridad es la dimensión donde menos hay que negociar. Estos son los elementos críticos:

- **`abs_brakes`**: frenos antibloqueo. **No negociable**. Reduce drásticamente la distancia de frenado en superficie mojada y permite mantener el control. Si un usado no lo tiene, descartarlo salvo para uso muy ocasional.
- **`airbag_for_driver_and_passenger`**: airbags frontales duales. **No negociable** para cualquier uso familiar o frecuente. Solo `driver_airbag` (sin acompañante) es aceptable en autos muy básicos y antiguos para uso esporádico individual.
- **`stability_control`**: control electrónico de estabilidad (ESP/ESC). **Muy recomendable**, especialmente en SUVs y vehículos altos donde el riesgo de vuelco es mayor. Estándar en gama media desde aproximadamente 2014-2016 en Argentina.
- **`parking_sensor` y `backup_camera`**: muy útiles, no críticos para seguridad activa pero sí para prevenir accidentes de baja velocidad y atropellos en marcha atrás (especialmente con niños cerca).
- **`alarm`** y **`central_door_locking`**: prevención de robo y seguridad de niños dentro del vehículo. Estándar en casi todos los modelos modernos.
- **`headlights_with_automatic_leveling`** y **`rain_sensor`**: comodidad y seguridad en condiciones cambiantes, no críticos.
- **`rear_defroster`** y **`rear_fog_lights`**: útiles según clima de la región del usuario.
- **`armored`**: blindaje. Nicho específico (zonas de riesgo, perfiles específicos). Encarece mucho el `price`, aumenta peso y consumo, complica reventa. Recomendar solo si el comprador lo pide expresamente.

---

## 20. Equipamiento de confort (`equipment.confort`)

El confort impacta directamente en la experiencia diaria y debe ponderarse según el uso:

- **`air_conditioner`**: **no negociable** en Argentina. Salvo presupuesto extremadamente bajo y uso en clima frío, un auto sin aire es un mal negocio incluso si el `price` es atractivo (instalación posterior cuesta mucho).
- **`electric_windows`**: estándar en cualquier auto post-2010 de gama media. Su ausencia indica versión muy básica.
- **`heating`**: indispensable en climas fríos (Patagonia, Cuyo en invierno).
- **`steering_wheel_radio_remote_control`**: comodidad real al manejar, evita distraerse buscando botones en el panel.
- **`remote_trunk_opening`** y **`automatic_window_closing`**: comodidades agradables, no críticas.
- **`cup_holder`**: aparentemente trivial, pero realmente importante en uso diario y viajes.

---

## 21. Equipamiento de entretenimiento (`equipment.entertainment`)

El equipamiento de entretenimiento envejece rápido pero impacta en la experiencia:

- **`bluetooth`** y **`usb_input`**: **prácticamente indispensables hoy** para llamadas manos libres y carga/reproducción de música. Su ausencia en un auto post-2015 indica versión base muy desactualizada.
- **`am_fm`**: estándar mínimo, no diferenciador.
- **`auxiliar_input`** (conector 3.5mm): útil como respaldo, no crítico.
- **`cd`, `dvd`, `mp3_player`**: tecnologías obsoletas o de nicho. No suman valor real hoy salvo gusto particular.

Si el usuario hace muchas llamadas o usa apps de navegación (Waze, Google Maps), priorizar fuertemente Bluetooth y conexión USB con CarPlay/Android Auto si está disponible (no siempre figura en el JSON pero conviene preguntar).

---

## 22. Equipamiento interior y exterior

En `equipment.interior`:
- **`leather_upholstery`**: tapizado de cuero. Más durable y fácil de limpiar (importante con niños o mascotas), eleva la sensación de calidad y la reventa. En climas muy calurosos requiere ventilación adicional porque se calienta más que la tela.

En `equipment.exterior`:
- **`alloy_wheels`**: llantas de aleación. Estéticamente superiores, más livianas (mejora mínimamente consumo y manejo), pero más costosas de reparar tras golpes. Estándar en gama media-alta.
- **`retractable_electric_sunroof`**: techo corredizo. Lujo, nicho. Aumenta posibles puntos de filtración con los años en usados.
- **`spare_tire_carrier`**: porta-rueda de auxilio externa, típico de SUVs y Pickups serios.
- **`clean_rear_window`**: limpia-luneta trasero. Muy útil en Hatchbacks y SUVs (no aplica a sedanes).
- **`roof_luggage_rack`**: barras de techo. Útiles para viajes con bicicletas, valijas extra, equipos deportivos.

---

## 23. Performance: cilindrada, potencia y dimensiones (`equipment.performance` y `engine`)

El `engine` (cilindrada en litros, ej. "1.5", "2.0") y los datos de `equipment.performance` definen el carácter del vehículo:

- **`power`** (potencia en CV o HP): a igual cilindrada, motores turbo entregan más potencia. Una potencia adecuada según peso del vehículo es clave: menos de 70 CV en un sedán mediano será sufrido en ruta; más de 150 CV en un Hatchback chico será derroche para uso urbano.
- **`tank_capacity`** (capacidad del tanque): impacta en autonomía. Menos de 45 litros = paradas frecuentes en viajes largos. Más de 60 litros = autonomía cómoda.
- **`wheelbase`** (distancia entre ejes): a mayor distancia entre ejes, más estabilidad en ruta y más espacio interior. Wheelbase mayor a 2700mm indica auto mediano/grande.
- **`length_height_width`**: dimensiones externas. Críticas para garage chico, calles angostas, estacionamiento difícil. Un vehículo de más de 4.7m de largo es complicado de estacionar en calles porteñas o de microcentro.
- **`valves_per_cylinder`**: 4 válvulas por cilindro es el estándar moderno y entrega mejor respiración del motor; 2 válvulas es tecnología antigua aceptable solo en autos básicos viejos.

Relación cilindrada/uso recomendada: 1.0-1.4 ciudad y poco peso; 1.5-1.6 uso mixto; 1.8-2.0 ruta intensiva y SUV compactos; 2.0+ SUV grandes, Pickups y deportivos.

---

## 24. Vehículos eléctricos y `equipment.other_features`

Los vehículos eléctricos requieren análisis específico de los campos en `equipment.other_features`:

- **`battery_capacity`** (kWh): determina autonomía. Menos de 30 kWh = uso solo urbano (autonomía real 150-200 km). Entre 40-60 kWh = uso mixto razonable. Más de 70 kWh = autonomía cómoda incluso en ruta.
- **`battery_life`** (años o porcentaje de degradación): clave en usados. Una batería con menos del 80% de capacidad original empieza a impactar la usabilidad.
- **`charging_time`** (horas): tiempo de carga completa. Cargador hogareño común (220V/16A) tarda 6-12 horas; carga rápida pública 30-60 minutos al 80%.
- **`charger_type`**: compatibilidad con cargadores disponibles en Argentina (Type 2, CCS, CHAdeMO).
- **`battery_type`**: química de la batería (litio-ion estándar, LFP más durable y seguro).

Recomendar eléctrico solo cuando: el usuario tiene cochera con toma 220V, recorre menos de 100 km diarios, y vive en zona con red de carga rápida cercana. De lo contrario, sugerir híbrido como paso intermedio.

Otros campos relevantes:
- **`autopilot`**: asistencia avanzada de manejo. Función premium, exige actualización constante del sistema.
- **`on_board_computer`**: computadora de a bordo con datos de consumo, autonomía, etc. Estándar en gama media moderna.
- **`lights_on_alarm`**: alarma de luces encendidas (al bajarse del auto). Útil, no crítico.

---

## 25. Garantía y condiciones de compra (`equipment.warranty_and_conditions`)

Estos campos cambian significativamente el riesgo de la operación:

- **`factory_warranty`**: garantía de fábrica vigente. En Argentina típicamente 3 años o 100.000 km. **Reduce drásticamente el riesgo** en un usado relativamente nuevo. Verificar transferibilidad al nuevo dueño.
- **`mechanical_warranty`**: garantía mecánica otorgada por el vendedor (concesionario o agencia). Suele ser de 3 a 12 meses. Mejora la posición del comprador en usados. Leer la letra chica: qué cubre y qué no.
- **`negotiable_price`**: si el precio es negociable, hay margen real para regateo (típicamente 5-10%).
- **`accept_exchange`**: el vendedor acepta entrega de otro vehículo como parte de pago. Útil para quienes tienen que vender el actual.
- **`home_delivery`**: entrega a domicilio. Comodidad logística.
- **`virtual_tours`** y **`test_drive_at_home`**: facilitan la evaluación sin movilizarse. Muy útiles fuera de las grandes ciudades.

Para usados, priorizar fuertemente las publicaciones con `warranty_and_conditions.mechanical_warranty` true sobre las que no la ofrecen, aun a precio levemente superior.

---

## 26. Análisis del campo `sole_owner` (único dueño)

El campo `sole_owner` indica si el vehículo tuvo un solo dueño desde nuevo:

- **`sole_owner` = true**: indicador positivo fuerte. Suele correlacionar con historial de service uniforme, mejor cuidado, y posibilidad de obtener la "vida completa" del auto al hablar con el vendedor original.
- **`sole_owner` = false**: no es descalificador, pero exige mayor due diligence. Pedir cantidad exacta de dueños previos, motivos de cambio, y verificar VTV/RTO al día.
- **`sole_owner` = null**: información no disponible. Tratar como neutral pero pedir aclaración al vendedor.

Un auto con más de tres dueños en menos de 7 años suele ser señal de alerta (auto problemático que se va pasando, uso intensivo no declarado, o reventa especulativa).

---

## 27. Recomendación según color (`color`)

El `color` impacta en reventa, mantenimiento y experiencia:

- **Colores neutros (Blanco, Gris, Plata, Negro)**: máxima reventa, demanda alta en el mercado de usados. El Blanco refleja calor (ventaja en zonas calurosas como Mendoza, San Juan, Norte). El Negro luce muy bien pero exige más mantenimiento (rayones visibles, calor excesivo).
- **Colores intermedios (Azul oscuro, Rojo, Beige)**: aceptación normal, sin penalidad en reventa pero sin premio.
- **Colores llamativos o nicho (Amarillo, Naranja, Verde fluorescente, Violeta)**: reducen la audiencia compradora en el futuro, pueden penalizar el precio de reventa en 5-10%. Solo recomendar si el comprador planea quedarse con el auto muchos años.

El color rara vez debe ser determinante en una recomendación, pero sí mencionarlo cuando el comprador piensa revender en pocos años.

---

## 28. Marcas más recomendables en Argentina por confiabilidad y red de service

Para el mercado argentino, las marcas con mejor relación entre confiabilidad mecánica, disponibilidad de repuestos y red de service a 2024-2025 son aproximadamente:

- **Toyota**: máxima confiabilidad histórica, valor de reventa altísimo. Service caro pero infrecuente. Modelos clave: Corolla, Etios, Yaris, Hilux, SW4, Corolla Cross.
- **Volkswagen**: muy buena ingeniería, red amplia. Repuestos accesibles. Modelos clave: Gol, Polo, Vento, T-Cross, Amarok.
- **Ford**: red amplia, repuestos disponibles. Modelos modernos confiables. Modelos clave: Ka, EcoSport, Ranger, Territory.
- **Chevrolet**: presencia histórica fuerte, repuestos baratos en modelos populares. Modelos clave: Onix, Tracker, Cruze, S10.
- **Renault**: buena relación precio/equipamiento, red amplia. Modelos clave: Kwid, Sandero, Logan, Duster, Captur.
- **Fiat**: economía y simplicidad mecánica, repuestos abundantes en modelos clásicos. Modelos clave: Cronos, Mobi, Argo, Toro.
- **Peugeot / Citroën**: equipamiento generoso por precio, pero repuestos y mantenimiento más caros que la media. Mejor en 0km con garantía que en usados antiguos.
- **Nissan**: confiabilidad sólida, red más reducida. Modelos clave: Versa, Frontier, Kicks.
- **Honda**: excelente confiabilidad mecánica, red más chica y repuestos más caros. Modelos clave: City, HR-V.

Marcas premium europeas (Audi, BMW, Mercedes-Benz) son aspiracionales pero el costo de mantenimiento fuera de garantía puede ser prohibitivo. Recomendar usados premium solo a compradores con presupuesto holgado para imprevistos.

Marcas con menor penetración (Chery, JAC, BAIC, DFSK, Geely): repuestos limitados, red pequeña. Pueden ser opciones de bajo costo inicial pero alto costo de salida.

---

## 29. Señales de alerta (red flags) en un anuncio de vehículo

Independientemente del modelo, ciertas combinaciones deben encender alarmas en el agente:

- **Precio sustancialmente bajo respecto al promedio del modelo/año/kilometraje**: posible auto chocado y mal reparado, con deuda, gravamen, o problema legal. Investigar.
- **`mileage` muy bajo en `vehicle.year` antiguo**: posible cuentakilómetros adulterado.
- **`sole_owner` false con varios dueños en pocos años**: auto problemático.
- **Ausencia de fotos del interior, motor o baúl**: el vendedor oculta algo.
- **`warranty_and_conditions` todo en false o null**: vendedor no quiere comprometerse con nada.
- **Imposibilidad de hacer test drive o ver el auto en persona**: descalificador casi automático.
- **Vendedor apurado, insistente, o que se niega a verificación mecánica independiente**: alerta máxima.
- **VTV / RTO vencida o irregular** (información a pedir aparte si no está en el JSON).
- **Conjunto de equipamiento incongruente** (ej. auto base 2010 sin ABS ni airbags y `price` similar a una versión full): error de carga o intento de engaño.

---

## 30. Cómo estructurar una recomendación final al usuario

Cuando el agente entrega una recomendación, debe seguir esta estructura para máxima claridad:

1. **Resumen del perfil entendido**: recapitular qué se entendió del usuario (uso, presupuesto, prioridades). Esto permite al usuario corregir si algo se malinterpretó.
2. **Vehículo o vehículos recomendados**: nombrarlos con `vehicle.model.brand.name`, `vehicle.model.name`, `vehicle.year`, `vehicle.version`, `price`, `currency`, `mileage`. Si hay más de uno, ordenar de más a menos recomendado.
3. **Razones específicas**: para cada recomendado, listar 3-5 razones concretas anclaadas en los campos del registro (ej: "tiene `transmission` Automática ideal para tu uso urbano", "el `mileage` de 45.000 km en un 2020 es muy bajo y promete vida útil larga").
4. **Aspectos a verificar**: qué debe el usuario chequear personalmente o consultar al vendedor (estado real, historial, VTV, deuda de patentes).
5. **Alternativas descartadas y por qué**: si había candidatos cercanos que no se eligieron, explicar brevemente. Eso construye confianza.
6. **Advertencias o limitaciones**: si la recomendación tiene caveats (presupuesto justo, modelo con un punto débil conocido), decirlo abiertamente.

Una buena recomendación combina la objetividad de los datos del registro con la honestidad de admitir incertidumbres. El agente no debe sobrevender ni minimizar problemas reales.

---

## 31. Glosario de mapeo entre lenguaje del usuario y campos del JSON

Para facilitar la traducción entre las consultas en lenguaje natural y los campos de la base, este glosario asocia términos comunes con campos técnicos:

- "Auto chico", "auto urbano", "para la ciudad" → `body_type` Hatchback o City Car, `engine` 1.0-1.4
- "Auto familiar", "para la familia" → `body_type` Sedán, SUV o Minivan; `people_capacity` ≥ 5; `doors` = 4 o 5
- "Camioneta" → `body_type` SUV o Pickup; `traction_control` 4x4 frecuente
- "Auto para trabajar", "para reparto" → `body_type` Furgón o Pickup; `fuel_type` Diésel; marcas masivas
- "Económico de mantener" → marcas masivas (Fiat, VW, Chevrolet, Renault); `engine` chico; `fuel_type` Nafta o GNC
- "Que ande bien en ruta" → `engine` ≥ 1.6; `equipment.security.stability_control`; `equipment.performance.tank_capacity` ≥ 50
- "Para nieve / montaña" → `traction_control` 4x4 o Integral; `body_type` SUV
- "Para principiante" → `transmission` Automática; `engine` chico; `direction` Eléctrica
- "Seguro" → `equipment.security.abs_brakes` true, `airbag_for_driver_and_passenger` true, `stability_control` true
- "Cómodo" → `transmission` Automática; `direction` Eléctrica; `equipment.confort.air_conditioner`; `equipment.interior.leather_upholstery`
- "Moderno" / "Equipado" → `equipment.entertainment.bluetooth` true; `equipment.entertainment.usb_input` true; `equipment.security.backup_camera`; `vehicle.year` reciente
- "Barato" → `price` en rango bajo; aceptar `vehicle.year` mayor y `mileage` mayor
- "Bajo kilometraje" → `mileage` con promedio anual menor a 12.000 km/año respecto a `vehicle.year`
- "Eléctrico" → `fuel_type` Eléctrico; revisar `equipment.other_features.battery_*`
- "Híbrido" → `fuel_type` Híbrido
- "Manual / Automático" → `transmission` Manual o Automática
- "Diésel" → `fuel_type` Diésel
- "GNC" → `fuel_type` GNC o referencias a "gas natural"

Este mapeo es la última capa de traducción que el agente debe considerar antes de filtrar la base relacional o de armar la respuesta final.

---

## 32. Casos límite y respuestas honestas

Hay situaciones donde la mejor recomendación es **no recomendar nada de lo disponible**:

- Si el presupuesto del usuario es claramente insuficiente para sus necesidades (ej: familia de 6 con presupuesto de City Car básico), el agente debe decirlo y sugerir esperar y ahorrar, o reformular las necesidades.
- Si todas las opciones disponibles en la base tienen red flags (ningún `warranty_and_conditions` activo, todos con `mileage` excesivo, todos con `sole_owner` false), comunicarlo en lugar de elegir "el menos malo" sin advertencia.
- Si el uso declarado (ej: todoterreno serio) no se cubre con ningún registro disponible (ej: solo hay Sedanes), informarlo honestamente.
- Si la consulta es contradictoria internamente (ej: "auto deportivo para llevar 7 personas y económico"), pedir aclaración o priorización.

Una recomendación honesta vale más que una venta forzada. El agente debe transmitir esa filosofía al usuario.