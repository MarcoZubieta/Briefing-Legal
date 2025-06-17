# Configuración de Email y GitHub para el Briefing

## 📧 Configuración de EmailJS

### Paso 1: Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Registra una cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar servicio de email
1. En el dashboard de EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Copia el **Service ID** que te asignen

### Paso 3: Crear template de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Configura el template con estas variables:
   ```
   Subject: {{subject}}
   
   Hola {{to_name}},
   
   {{message}}
   
   Timestamp: {{timestamp}}
   
   Atentamente,
   {{from_name}}
   {{from_company}}
   ```
4. Copia el **Template ID**

### Paso 4: Obtener Public Key
1. Ve a "Account" en el menú principal
2. Encuentra tu **Public Key** en la sección API Keys

### Paso 5: Actualizar config.js
Edita el archivo `js/config.js` y reemplaza:
```javascript
SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID', // Tu Service ID
TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID', // Tu Template ID  
PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY', // Tu Public Key
```

## 🐙 Configuración de GitHub

### Paso 1: Crear Personal Access Token
1. Ve a GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Haz clic en "Generate new token (classic)"
3. Selecciona estos permisos:
   - ✅ **repo** (acceso completo a repositorios)
   - ✅ **workflow** (si planeas usar GitHub Actions)
4. Copia el token generado ⚠️ **Solo se muestra una vez**

### Paso 2: Actualizar config.js
Edita el archivo `js/config.js` y reemplaza:
```javascript
TOKEN: 'YOUR_GITHUB_TOKEN', // Tu Personal Access Token
OWNER: 'marcozubieta', // Tu usuario de GitHub
REPO: 'Briefing-Legal', // Nombre del repositorio
```

## 📂 Estructura de archivos resultante

Cuando funcione correctamente, los briefings se guardarán en:
```
briefings/
├── briefing-santiago-palacios-2024-06-17T18-30-45.txt
├── briefing-santiago-palacios-2024-06-17T19-15-22.txt
└── ...
```

## ✅ Verificación de funcionamiento

### Para EmailJS:
1. Completa el formulario
2. Haz clic en "Confirmar y Enviar Briefing"
3. Revisa que lleguen emails a:
   - santiago.palacios@email.com
   - marco.zubieta@symbiosisresearch.com

### Para GitHub:
1. Después del envío exitoso
2. Ve a tu repositorio en GitHub
3. Navega a la carpeta `briefings/`
4. Verifica que se haya creado el nuevo archivo

## 🔒 Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas las credenciales reales al repositorio público
- Considera usar variables de entorno en producción
- El token de GitHub tiene acceso completo, manéjalo con cuidado

## 🆘 Solución de problemas

### Error de CORS con GitHub API:
- Verifica que el token tenga los permisos correctos
- Asegúrate de que el repositorio exista y tengas acceso

### No llegan emails:
- Verifica la configuración del servicio en EmailJS
- Revisa la consola del navegador para errores
- Confirma que las direcciones de email sean correctas

### Error "EmailJS no está cargado":
- Verifica que la librería se cargue desde el CDN
- Revisa la consola para errores de red
- Asegúrate de tener conexión a internet

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
1. La consola del navegador (F12 → Console)
2. Los logs en EmailJS dashboard
3. Los mensajes de error en la interfaz

