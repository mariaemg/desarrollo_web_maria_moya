import os
import hashlib
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash
from markupsafe import escape
from werkzeug.utils import secure_filename
import filetype

from database import *

# Carpeta de uploads dentro de 'static/uploads'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'heic'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def registrar_error(mensaje, categoria, errores):
    flash(mensaje, categoria)
    errores.append((mensaje, categoria))

def formatear_unidad_edad(unidad, cantidad):
    # Devuelve 'año'/'años' o 'mes'/'meses' según cantidad
    if unidad == "a":
        return "año" if cantidad == 1 else "años"
    elif unidad == "m":
        return "mes" if cantidad == 1 else "meses"
    return unidad

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'KJHGSAFGDTEQQQ'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['DEBUG'] = True

    @app.route("/")
    def index(): # Portada
        session = getSession()
        ultimos_avisos = (
            session.query(AvisoAdopcion)
            .order_by(AvisoAdopcion.fecha_ingreso.desc())
            .limit(5)
            .all()
        )
        avisos_seguro = []
        for aviso in ultimos_avisos:
            fotos_nombres = [os.path.basename(f.ruta_archivo) for f in aviso.fotos]
            contactos = [f"{c.nombre.capitalize()}: {c.identificador}" for c in aviso.contactos]
            unidadEdad_final = formatear_unidad_edad(aviso.unidad_medida, aviso.edad)
            plural_tipo = aviso.tipo.capitalize() + ("s" if aviso.cantidad > 1 else "")
            avisos_seguro.append({
                "fecha_publicacion": aviso.fecha_ingreso.strftime("%d/%m/%Y %H:%M"),
                "fecha_entrega": aviso.fecha_entrega.strftime("%d/%m/%Y %H:%M"),
                "comuna": escape(aviso.comuna.nombre),
                "sector": escape(aviso.sector or "No se especificó"),
                "cantidad": aviso.cantidad,
                "tipo": plural_tipo,
                "edad": aviso.edad,
                "unidadEdad": unidadEdad_final,
                "contactos": contactos,
                "fotos": fotos_nombres
            })
        session.close()
        return render_template("index.html", avisos=avisos_seguro)

    @app.route("/form") # Mostrar formulario
    def form():
        session = getSession()
        session.close()
        return render_template("form.html", datos={})

    @app.route("/agregar_aviso", methods=["POST"])
    def agregar_aviso():
        session = getSession()
        errores = []

        # Datos del formulario
        region_id = request.form.get("region", "")
        comuna_id = request.form.get("comuna", "")
        sector = request.form.get("sector", "")
        nombrecontacto = request.form.get("nombre", "")
        email = request.form.get("email", "")
        celular = request.form.get("celular", "")
        contactar_por_nombres = request.form.getlist("contactarPor")
        contacto_identificadores = [request.form.get(f"contactoID[{nombre}]", "").strip() for nombre in contactar_por_nombres]

        tipo = request.form.get("tipo", "").capitalize()
        cantidad = request.form.get("cantidad", "0")
        edad = request.form.get("edad", "0")
        unidad_medida = request.form.get("unidadEdad", "")[0:1].lower()
        fecha_entrega_str = request.form.get("fechaEntrega", "")
        fecha_ingreso_str = request.form.get("fechaIngreso", "")
        descripcion = request.form.get("descripcion", "")
        fotos = request.files.getlist("fotos")

        # Validaciones
        if not region_id:
            registrar_error("Debe seleccionar región.", "region", errores)
        if not comuna_id:
            registrar_error("Debe seleccionar comuna.", "comuna", errores)
        if tipo.lower() not in ["gato", "perro"]:
            registrar_error("Debe seleccionar tipo.", "tipo", errores)
        if unidad_medida not in ["a", "m"]:
            registrar_error("Debe seleccionar unidad de edad.", "unidadEdad", errores)
        if not nombrecontacto or len(nombrecontacto) < 3 or len(nombrecontacto) > 200:
            registrar_error("Nombre inválido (3-200 caracteres).", "nombre", errores)
        if not email or len(email) > 100:
            registrar_error("Email inválido.", "email", errores)
        else:
            import re
            if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
                registrar_error("Email inválido.", "email", errores)
        if celular:
            import re
            if not re.match(r"^\+\d{1,3}\.\d{8,12}$", celular):
                registrar_error("Formato celular: +NNN.NNNNNNNN", "celular", errores)
        if sector and len(sector) > 100:
            registrar_error("Máximo 100 caracteres en sector.", "sector", errores)
        if descripcion and len(descripcion) > 500:
            registrar_error("Máximo 500 caracteres en descripción.", "descripcion", errores)
        try:
            cantidad_val = int(cantidad)
            if cantidad_val < 1:
                registrar_error("Cantidad debe ser >= 1", "cantidad", errores)
        except ValueError:
            registrar_error("Cantidad inválida", "cantidad", errores)
        try:
            edad_val = int(edad)
            if edad_val < 1:
                registrar_error("Edad debe ser >= 1", "edad", errores)
        except ValueError:
            registrar_error("Edad inválida", "edad", errores)

        # Fechas
        if not fecha_entrega_str:
            registrar_error("Fecha de entrega obligatoria.", "fechaEntrega", errores)
        else:
            try:
                fecha_entrega = datetime.fromisoformat(fecha_entrega_str)
                fecha_ingreso = datetime.fromisoformat(fecha_ingreso_str)
                if fecha_entrega < fecha_ingreso:
                    registrar_error("La fecha de entrega debe ser >= fecha actual.", "fechaEntrega", errores)
            except ValueError:
                registrar_error("Formato de fecha inválido.", "fechaEntrega", errores)

        # Contactos
        if len(contactar_por_nombres) > 5:
            registrar_error("Máximo 5 medios de contacto permitidos.", "contactarPor", errores)

        for nombre, identificador in zip(contactar_por_nombres, contacto_identificadores):
            if not identificador:
                registrar_error(f"Debe ingresar un identificador para {nombre}.", "contactoID", errores)
            elif len(identificador) < 4 or len(identificador) > 50:
                registrar_error(f"El identificador de {nombre} debe tener entre 4 y 50 caracteres.", "contactoID", errores)

        # Fotos
        fotos_validas = []
        if not fotos or len([f for f in fotos if f.filename]) < 1:
            registrar_error("Debe subir entre 1 y 5 fotos.", "fotos", errores)
        elif len(fotos) > 5:
            registrar_error("Máximo 5 fotos permitidas.", "fotos", errores)
        else:
            for f in fotos:
                if f.filename:
                    contenido = f.read()
                    f.seek(0)
                    tipo_detectado = filetype.guess(contenido)
                    if not tipo_detectado or not tipo_detectado.mime.startswith("image/"):
                        registrar_error(f"Archivo {f.filename} no es válido.", "fotos", errores)
                    elif allowed_file(f.filename):
                        fotos_validas.append(f)
                    else:
                        registrar_error(f"Archivo {f.filename} no es válido.", "fotos", errores)

        if errores:
            session.close()
            return render_template("form.html", datos=request.form, guardado=False)

        # Guardar aviso
        nuevo_aviso = AvisoAdopcion(
            comuna_id=int(comuna_id),
            sector=sector,
            nombre=nombrecontacto,
            email=email,
            celular=celular,
            tipo=tipo,
            cantidad=int(cantidad),
            edad=int(edad),
            unidad_medida=unidad_medida,
            fecha_entrega=fecha_entrega,
            fecha_ingreso=fecha_ingreso,
            descripcion=descripcion
        )
        session.add(nuevo_aviso)
        session.flush()

        # Guardar contactos
        for nombre, identificador in zip(contactar_por_nombres, contacto_identificadores):
            if identificador:
                contacto = ContactarPor(
                    nombre=nombre.capitalize(),
                    identificador=identificador,
                    aviso_id=nuevo_aviso.id
                )
                session.add(contacto)

        # Guardar fotos
        for f in fotos_validas:
            contenido = f.read()
            f.seek(0)
            nombre_seguro = secure_filename(f.filename)
            hash_random = hashlib.sha256(contenido + os.urandom(16)).hexdigest()[:16]
            extension = os.path.splitext(nombre_seguro)[1]
            nombre_final = f"{hash_random}{extension}"
            ruta_guardada = os.path.join(app.config['UPLOAD_FOLDER'], nombre_final)
            f.save(ruta_guardada)

            foto = Foto(
                ruta_archivo=ruta_guardada,
                nombre_archivo=nombre_final,
                aviso_id=nuevo_aviso.id
            )
            session.add(foto)

        session.commit()
        session.close()
        return render_template("form.html", datos={}, guardado=True, nombre_aviso=nombrecontacto)

    @app.route("/list") # Listado de adopciones
    def list():
        session = getSession()
        page = int(request.args.get("page", 1))
        per_page = 5
        total_avisos = session.query(AvisoAdopcion).count()
        total_pages = (total_avisos + per_page - 1) // per_page

        avisos = (
            session.query(AvisoAdopcion)
            .order_by(AvisoAdopcion.fecha_ingreso.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
            .all()
        )
        avisos_seguro = []
        for aviso in avisos:
            fotos_nombres = [os.path.basename(f.ruta_archivo) for f in aviso.fotos]
            contactos = [f"{c.nombre.capitalize()}: {c.identificador}" for c in aviso.contactos]
            unidadEdad_final = formatear_unidad_edad(aviso.unidad_medida, aviso.edad)
            plural_tipo = aviso.tipo.capitalize() + ("s" if aviso.cantidad > 1 else "")
            avisos_seguro.append({
                "id": aviso.id,
                "fecha_publicacion": aviso.fecha_ingreso.strftime("%d/%m/%Y %H:%M"),
                "fecha_entrega": aviso.fecha_entrega.strftime("%d/%m/%Y %H:%M"),
                "comuna": escape(aviso.comuna.nombre),
                "sector": escape(aviso.sector or "No se especificó"),
                "cantidad": aviso.cantidad,
                "tipo": plural_tipo,
                "edad": aviso.edad,
                "unidadEdad": unidadEdad_final,
                "contactos": contactos,
                "fotos": fotos_nombres
            })
        session.close()
        return render_template("list.html", avisos=avisos_seguro, page=page, total_pages=total_pages)

    @app.route("/avisos/<int:aviso_id>") # Detalle de aviso particular
    def detalle_aviso(aviso_id):
        session = getSession()
        aviso = session.query(AvisoAdopcion).get(aviso_id)
        if not aviso:
            flash("El aviso solicitado no existe.", "error")
            return redirect(url_for("list"))

        fotos = [os.path.basename(f.nombre_archivo) for f in aviso.fotos]
        contactos = [f"{c.nombre.capitalize()}: {c.identificador}" for c in aviso.contactos]
        unidadEdad_final = formatear_unidad_edad(aviso.unidad_medida, aviso.edad)
        plural_tipo = aviso.tipo.capitalize() + ("s" if aviso.cantidad > 1 else "")

        aviso_data = {
            "id": aviso.id,
            "fecha_publicacion": aviso.fecha_ingreso.strftime("%d/%m/%Y %H:%M"),
            "fecha_entrega": aviso.fecha_entrega.strftime("%d/%m/%Y %H:%M"),
            "comuna": escape(aviso.comuna.nombre),
            "sector": escape(aviso.sector or "No se especificó"),
            "cantidad": aviso.cantidad,
            "tipo": plural_tipo,
            "edad": aviso.edad,
            "unidadEdad": unidadEdad_final,
            "nombre": escape(aviso.nombre),
            "contactos": contactos,
            "fotos": fotos
        }

        session.close()
        return render_template("informacion-adopcion.html", aviso=aviso_data)

    @app.route("/stats") # Estadísticas, por el momento estáticas
    def stats():
        return render_template("estadisticas.html")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
