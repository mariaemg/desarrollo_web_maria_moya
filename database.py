from datetime import datetime
from sqlalchemy import (
    create_engine, String, Integer, DateTime, Enum, Text, ForeignKey
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

# Declarative Base
class Base(DeclarativeBase):
    pass

# Conexión y sesión
def getSession():
    DB_USER = "cc5002"
    DB_PASS = "programacionweb"
    DB_HOST = "localhost"
    DB_PORT = 3306
    DB_NAME = "tarea2"

    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(DATABASE_URL, echo=True)
    return Session(engine)

# Modelos

class Region(Base):
    __tablename__ = "region"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)

    comunas: Mapped[list["Comuna"]] = relationship(back_populates="region")

class Comuna(Base):
    __tablename__ = "comuna"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    region_id: Mapped[int] = mapped_column(ForeignKey("region.id"), nullable=False)

    region: Mapped["Region"] = relationship(back_populates="comunas")
    avisos: Mapped[list["AvisoAdopcion"]] = relationship(
        back_populates="comuna",
        cascade="all, delete-orphan"
    )

class AvisoAdopcion(Base):
    __tablename__ = "aviso_adopcion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    fecha_ingreso: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    comuna_id: Mapped[int] = mapped_column(ForeignKey("comuna.id"), nullable=False)
    sector: Mapped[str] = mapped_column(String(100), nullable=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    celular: Mapped[str] = mapped_column(String(15), nullable=True)
    tipo: Mapped[str] = mapped_column(Enum("gato", "perro", name="tipo_mascota_enum"), nullable=False)
    cantidad: Mapped[int] = mapped_column(Integer, nullable=False)
    edad: Mapped[int] = mapped_column(Integer, nullable=False)
    unidad_medida: Mapped[str] = mapped_column(Enum("a", "m", name="unidad_medida_enum"), nullable=False)
    fecha_entrega: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)

    comuna: Mapped["Comuna"] = relationship(back_populates="avisos")
    fotos: Mapped[list["Foto"]] = relationship(
        back_populates="aviso",
        cascade="all, delete-orphan"
    )
    contactos: Mapped[list["ContactarPor"]] = relationship(
        back_populates="aviso",
        cascade="all, delete-orphan"
    )

class Foto(Base):
    __tablename__ = "foto"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ruta_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    nombre_archivo: Mapped[str] = mapped_column(String(300), nullable=False)
    aviso_id: Mapped[int] = mapped_column(ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso: Mapped["AvisoAdopcion"] = relationship(back_populates="fotos")

class ContactarPor(Base):
    __tablename__ = "contactar_por"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(
        Enum("whatsapp", "telegram", "X", "instagram", "tiktok", "otra", name="medio_contacto_enum"),
        nullable=False
    )
    identificador: Mapped[str] = mapped_column(String(150), nullable=False)
    aviso_id: Mapped[int] = mapped_column(ForeignKey("aviso_adopcion.id"), nullable=False)

    aviso: Mapped["AvisoAdopcion"] = relationship(back_populates="contactos")