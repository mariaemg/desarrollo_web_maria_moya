# Tarea 2 - Desarrollo Web

## Descripción
En esta segunda parte del proyecto, añadimos dinamismo a la página web por medio de Flask y de la implementación de una base de datos usando SQLAlchemy.

## Estructura del proyecto
- **app.py**: Archivo principal con la aplicación de Flask y definición de rutas. 
- **database.py**: Configuración de SQLAlchemy y definición de los modelos de base de datos.  
- **templates/**: Carpeta con las páginas HTML (usamos Jinja2):
    - index.html: Plantilla con la portada de la página.
    - form.html: Plantilla con el formulario.
    - list.html: Plantilla con la lista de adopciones.
    - informacion-adopcion.html: Plantilla con la información detallada de un aviso, se accede haciendo click en alguna fila en la lista de adopciones.
    - estadisticas.html: Por el momento página estática con estadísticas ficticias.
- **static/**: Carpeta con elementos estáticos:
    - css: Carpeta con CSS correspondientes a cada plantilla html.
    - images: Imágenes asociadas a estadísticas, y placeholder para la ausencia de imágenes en algunos html.
    - js: Archivos JS del formulario.
    - uploads: Imágenes subidas por medio del formulario.

El formulario es validado tanto en el **frontend**, por medio del JS, como en el **backend**, por medio de Flask.

También, se dejó la lógica de **validación del formulario** en un js aparte debido a su extensión, buscando una mayor claridad. Se valida el formulario por medio de mis propias funciones, no utilizando las alertas predeterminadas que entrega el atributo required.

## Decisiones tomadas
- Se utilizó **Flexbox** para organizar los elementos en varias secciones, como las fotos de las tablas para que no fallaran con el padding o sobrepasaran el borde de estas.  
- Se agregaron **comentarios en el código** para mayor claridad, explicando el funcionamiento general cada archivo.  
- Se utilizó **Flask** con **Jinja2** para renderizar las plantillas y estructurar la aplicación en rutas claras (index, form, list, detalle_aviso, stats). 
- La persistencia de datos se maneja con **SQLAlchemy**, definiendo modelos para AvisoAdopcion, Foto, ContactarPor, Comuna, etc.
- Para garantizar seguridad, todos los campos de texto se guardan en la base de datos en crudo, y se aplican escapes al mostrar (usando **markupsafe.escape**) para prevenir inyecciones.
- Se implementaron validaciones en backend, más estrictas que las de frontend, para asegurar que el usuario no evite estas medidas.
- En la subida de imágenes, se implementó un sistema de nombres seguros con **hash** para evitar colisiones y accesos indebidos.
- El proyecto fue subido a **Git**, y se trabajó en la rama `Tarea2` para el desarrollo.  
