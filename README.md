# Tarea 1 - Desarrollo Web

## Descripción
Este proyecto consiste en un sitio web con varias páginas HTML y hojas de estilo en CSS que presentan información relacionada con la adopción de mascotas.

## Estructura del proyecto
- **index.html**: Página principal de inicio.  
- **form.html**: Formulario para ingresar datos relacionados a un nuevo aviso de adopción.  
- **list.html**: Página con lista de avisos de adopción.
- **informacion-adopcion.html**: Sección con información detallada sobre el proceso de un aviso de adopción específico por el cual se accede desde list.html.    
- **estadisticas.html**: Página con datos y estadísticas sobre adopciones.

Además, cada HTML tiene su archivo CSS correspondiente, aunque muchas veces reutilicé el CSS de index para mantener un estilo homogéneo; pero de esa forma garantizo estilos especiales para ciertos elementos de cada página, además de facilitar posibles cambios futuros que llegara a realizar sin necesidad de cambiar el estilo de todas las páginas a la vez.

También, se dejó la lógica de **validación del formulario** en un js aparte debido a su extensión, buscando una mayor claridad. Se valida el formulario por medio de mis propias funciones, no utilizando las alertas predeterminadas que entrega el atributo required.

## Decisiones tomadas
- Se utilizó **Flexbox** para organizar los elementos en varias secciones, como las fotos de las tablas para que no fallaran con el padding o sobrepasaran el borde de estas.  
- Se agregaron **comentarios en el código** para mayor claridad, explicando el funcionamiento general cada archivo.  
- Se mantuvo una estructura modular, separando el contenido en distintas páginas HTML para facilitar la navegación.  
- El proyecto fue subido a **Git**, y se trabajó en la rama `Tarea1` para el desarrollo.  
