# Sentinel Bot
Sentinel es un bot de discord que permite la gestión de entrada y salida, por cada una de esas acciones el bot informa a traves de un canal,
el cual tiene que estar configurado con anterioridad.
## Caracteristicas principales
- El bot avisa con anticipación o en la misma hora de entrada/salida establecida (modificable)
- Permite la personalización



## Instrucciones
Tener instalado NodeJS > 18
A continuación la lista de comandos que necesitas ejecutar.

 - `npm install` # Instalara las dependencias del bot.
 - `npm run build` # Permitira generar la build del bot.
 - `npm run deploy:commands` # Registrara todos los comandos.
 - `npm run start` # Iniciara el bot.

Estos se pueden utilizar de forma manual o se puede usar el comando `npm run setup` que hace exactamente lo mismo, pero en un solo comando.

### Variables de entorno
Las variables de entorno son muy importantes para el funcionamiento correcto, es preferible definirlas aqui y así evitar un gasto y tenerlas en la BD, esto va dentro de `.env`.
```env
TOKEN="" # Token de tu bot
DATABASE_URL="" # URL de la base de datos en este caso postgresql
NAME_SERVER="" # Nombre del servidor
CLIENT_ID="" # ID del cliente(bot)
SERVER_ID="" # ID del servidor en donde opera el bot
CHANNEL_ASISTENCIA_ID = "" # ID del canal de asistencia, es decir el canal donde se marcara la asistencia
CHANNEL_LOGS_ID = "" # ID del canal donde iran los logs
# esta opcion no es obligatoria
NAME_BOT = "" # Nombre del bot
```

### Zonas horarias
Adicionalmente puedes añadir dentro del archivo [timezone.ts](./src/utils/timezones.ts) las zonas horarias que prefieras y poder personalizar aún más el bot.

#### Importante
No es recomendable negarle los mensajes directos al bot ya que esto te permitira ser notificado de cualquier acción por parte del administrador.

- https://en.wikipedia.org/wiki/List_of_tz_database_time_zones