# Tarea 4 - Desarrollo Web

## Descripción
En esta cuarta parte del proyecto, se integró la aplicación con un backend adicional desarrollado en Spring Boot, el cual expone los avisos de adopción y permite evaluarlos.
Desde Flask se realizan solicitudes asíncronas (fetch) a este servicio para mostrar y evaluar los avisos directamente desde la interfaz.
Durante la carga de los datos, se muestra un mensaje de “Cargando...” hasta que el fetch finaliza, mejorando la experiencia del usuario.

## Estructura del proyecto
- **app.py**: Archivo principal con la aplicación de Flask y definición de rutas. 
- **database.py**: Configuración de SQLAlchemy y definición de los modelos de base de datos.  
- **templates/**: Carpeta con las páginas HTML (usamos Jinja2):
    - index.html: Plantilla con la portada de la página.
    - form.html: Plantilla con el formulario.
    - list.html: Plantilla con la lista de adopciones.
    - informacion-adopcion.html: Plantilla con la información detallada de un aviso, se accede haciendo click en alguna fila en la lista de adopciones. También, ahora muestra un apartado con todos los comentarios añadidos por los usuarios para el aviso mostrado, además del respectivo formulario para añadir más comentarios.
    - estadisticas.html: Muestra 3 gráficos asociados a diferentes estadísticas de las adopciones, que se actualizan realizando solicitudes a la base de datos de manera asíncrona.
    - evaluaciones.html: Muestra una tabla que contiene algunos datos de los avisos de adopción (mostrando los avisos de 5 en 5 por medio de paginación), además de la opción de evaluarlos con una calificación de 1 a 7 y el promedio de notas asociado a ellos.
- **static/**: Carpeta con elementos estáticos:
    - css: Carpeta con CSS correspondientes a cada plantilla html.
    - images: Placeholder para la ausencia de imágenes en algunos html.
    - js: Archivos JavaScript correspondientes al formulario, a informacion-adopcion.html y a evaluaciones.html, donde se realizan las peticiones al backend de Spring Boot.”
    - uploads: Imágenes subidas por medio del formulario.

El formulario es validado tanto en el **frontend**, por medio del JS, como en el **backend**, por medio de Flask.

También, se dejó la lógica de **validación del formulario** en un js aparte debido a su extensión, buscando una mayor claridad. Se valida el formulario por medio de mis propias funciones, no utilizando las alertas predeterminadas que entrega el atributo required.

Toda la lógica correspondiente a la **información de adopción** de un aviso particular también se dejó en un js aparte.

Para la lógica de las **evaluaciones**, se realizan peticiones asíncronas al backend de Spring Boot para obtener los datos que rellenan la tabla de avisos de adopción y para registrar nuevas notas de evaluación asociadas a cada aviso.

## Decisiones tomadas
- Se utilizó **Flexbox** para organizar los elementos en varias secciones, como las fotos de las tablas para que no fallaran con el padding o sobrepasaran el borde de estas.  
- Se agregaron **comentarios en el código** para mayor claridad, explicando el funcionamiento general cada archivo.  
- Se utilizó **Flask** con **Jinja2** para renderizar las plantillas y estructurar la aplicación en rutas claras (index, form, list, detalle_aviso, stats). 
- La persistencia de datos se maneja con **SQLAlchemy**, definiendo modelos para AvisoAdopcion, Foto, ContactarPor, Comuna, etc.
- Para garantizar seguridad, todos los campos de texto se guardan en la base de datos en crudo, y se aplican escapes al mostrar (usando **markupsafe.escape**) para prevenir inyecciones.
- Se implementaron validaciones en backend, más estrictas que las de frontend, para asegurar que el usuario no evite estas medidas.
- En la subida de imágenes, se implementó un sistema de nombres seguros con **hash** para evitar colisiones y accesos indebidos.
- Para el apartado de estadísticas se trabajó con la biblioteca **HighCharts** vista en clases.
- Para el apartado de comentarios se añadió una funcionalidad de **paginación** para evitar que se muestren demasiados comentarios de una sola vez, cargando de 5 en 5 comentarios para no saturar la vista, haciéndolo más agradable para el usuario.
- Se utilizó **fetch** para manejar las respuestas asociadas a obtener datos para las estadísticas y comentarios, para así procesar de manera asíncrona las solicitudes. Esto mejora la experiencia del usuario, ya que los comentarios se muestran automáticamente al agregarlos y las estadísticas se actualizan sin interrumpir la interacción con la página. Además, permite procesar múltiples solicitudes de datos de manera eficiente y fluida.
- Se integró la comunicación con un backend de Spring Boot, utilizando fetch desde Flask para mostrar los avisos de adopción paginados (5 por página), enviar notas de evaluación y renderizar dinámicamente los resultados sin recargar la página.
- Se añadió un indicador visual de carga (“Cargando...”) mientras se obtienen los datos desde el backend al cargar evaluaciones.html, mejorando la usabilidad del sistema. También se añade un indicador de carga mientras se añade la nueva nota ingresada por el usuario.
-Cuando se evalúa un aviso, el sistema actualiza únicamente el promedio de evaluación correspondiente, sin recargar toda la tabla, optimizando así el rendimiento y la experiencia del usuario.
- El proyecto fue subido a **Git**, y se trabajó en la rama `Tarea4` para el desarrollo.  
