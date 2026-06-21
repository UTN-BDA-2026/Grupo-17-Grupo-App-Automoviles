
const { execSync } = require('child_process');
const path = require('path');

try {

  const ahora = new Date();
  const fecha = ahora.toISOString()
    .split('.')[0]
    .replace('T', '_')
    .replace(/:/g, '-');
  
  const NOMBRE_CONTENEDOR = 'automoviles_db';
  const NOMBRE_VOLUMEN = 'mysql_mysqldata';
  
  const rutaDestino = path.resolve(__dirname);

  console.log('[DBA] Deteniendo el contenedor de MySQL (Enfriamiento)...');
  execSync(`docker container stop ${NOMBRE_CONTENEDOR}`);

  console.log('[DBA] Creando copia física comprimida mediante contenedor asistente...');
  execSync(`docker run --rm -v ${NOMBRE_VOLUMEN}:/origen -v "${rutaDestino}:/destino" alpine tar -czf /destino/backup_mysql_${fecha}.tar.gz -C /origen .`);

  console.log('[DBA] Reactivando el contenedor de MySQL...');
  execSync(`docker container start ${NOMBRE_CONTENEDOR}`);

  console.log(`\x1b[32m✔ ¡Éxito! Backup físico guardado en: ${rutaDestino}\\backup_mysql_${fecha}.tar.gz\x1b[0m`);

} 
catch (error) {
  console.error('\x1b[31m✖ Error crítico durante el proceso de backup:\x1b[0m', error.message);
  
  try {
    execSync('docker container start automoviles_db');
  } 
  catch (e) {}

}