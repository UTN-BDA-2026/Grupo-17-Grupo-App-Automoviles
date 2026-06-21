
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

try {

  const archivoBackup = process.argv[2];

  if (!archivoBackup) {
    console.error('\x1b[31m✖ Error: Debes especificar el nombre del archivo de backup.\x1b[0m');
    console.log('Ejemplo: npm run db:restore backup_mysql_2026-06-20.tar.gz');
    process.exit(1);
  }

  const NOMBRE_CONTENEDOR = 'automoviles_db';
  const NOMBRE_VOLUMEN = 'mysql_mysqldata';

  const carpetaBackups = path.resolve(__dirname);
  const rutaCompletaBackup = path.join(carpetaBackups, archivoBackup);

  if (!fs.existsSync(rutaCompletaBackup)) {
    console.error(`\x1b[31m✖ Error: El archivo "${archivoBackup}" no existe en la carpeta ${carpetaBackups}\x1b[0m`);
    process.exit(1);
  }

  console.log('[DBA RESTORE] ¡Archivo detectado con éxito! Iniciando protocolo de emergencia...');

  console.log('[DBA RESTORE] Deteniendo el contenedor de MySQL (Apagado completo)...');
  
  try {
    execSync(`docker container stop ${NOMBRE_CONTENEDOR}`);
  } 
  catch (e) {
    console.log('Aviso: El contenedor ya estaba detenido o no se pudo apagar de forma convencional.');
  }

  console.log('[DBA RESTORE] Vaciando volumen corrupto y extrayendo copia de seguridad sana...');  
  execSync(`docker run --rm -v ${NOMBRE_VOLUMEN}:/origen -v "${carpetaBackups}:/destino" alpine sh -c "rm -rf /origen/* && tar -xzf /destino/${archivoBackup} -C /origen"`);

  console.log('[DBA RESTORE] Reactivando el contenedor de MySQL con los nuevos archivos...');
  execSync(`docker container start ${NOMBRE_CONTENEDOR}`);

  console.log(`\x1b[32m✔ ¡SISTEMA RESTAURADO COMPLETAMENTE! Tu base de datos ha vuelto al estado del backup: ${archivoBackup}\x1b[0m`);

} 
catch (error) {
  console.error('\x1b[31m✖ ERROR CRÍTICO DURANTE LA RESTAURACIÓN:\x1b[0m', error.message);
  console.log('Por seguridad, intenta levantar el contenedor manualmente ejecutando: docker container start mi-mysql-contenedor');
}