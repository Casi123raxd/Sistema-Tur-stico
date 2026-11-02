# Modelo Relacional y Diccionario de Datos
## Sistema Integrado de Información Turística Comunitaria de Cotapata (COTAPATA EXPLORA)
**Asignatura:** Análisis y Diseño de Sistemas

---

## 1. Diagrama Entidad-Relación (MER)

```mermaid
erDiagram
    ROL ||--o{ USUARIO : asigna
    AUTORIZACION ||--o{ CONTENIDO : respalda
    AUTORIZACION ||--o{ SERVICIO : autoriza
    AUTORIZACION ||--o{ ATRACTIVO : valida
    AUTORIZACION ||--o{ RUTA : aprueba
    AUTORIZACION ||--o{ RECOMENDACION : legitima

    CONTENIDO ||--|{ CONTENIDO_IDIOMA : traduce
    CONTENIDO ||--o| ESPECIE_DETALLE : complementa
    IDIOMA ||--o{ CONTENIDO_IDIOMA : especifica

    CATEGORIA_SERVICIO ||--o{ SERVICIO : clasifica
    COMUNARIO ||--o{ SERVICIO : ofrece

    USUARIO {
        int id_usuario PK
        string nombre_completo
        string correo UK
        string username UK
        string password_hash
        int id_rol FK
        string estado
        timestamp fecha_creacion
    }

    ROL {
        int id_rol PK
        string nombre UK
        string descripcion
    }

    IDIOMA {
        int id_idioma PK
        string codigo UK
        string nombre
    }

    AUTORIZACION {
        int id_autorizacion PK
        string codigo_autorizacion UK
        string tipo_entidad
        string otorgado_por
        string comunidad
        text observaciones
        date fecha_autorizacion
        boolean vigente
    }

    CONTENIDO {
        int id_contenido PK
        enum tipo
        enum estado_validacion
        int id_autorizacion FK
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    CONTENIDO_IDIOMA {
        int id_contenido_idioma PK
        int id_contenido FK
        int id_idioma FK
        string titulo
        text texto
        text dato_curioso
    }

    ESPECIE_DETALLE {
        int id_especie PK
        int id_contenido FK
        enum tipo_especie
        string nombre_cientifico
        enum categoria_fauna
        string archivo_imagen
        string archivo_audio
        boolean es_endemica
        string estado_conservacion
    }

    CATEGORIA_SERVICIO {
        int id_categoria PK
        string codigo UK
        string nombre_es
        string nombre_en
        string icono
        string descripcion
    }

    COMUNARIO {
        int id_comunario PK
        string nombre_referencial
        string comunidad
        string contacto_autorizado
        boolean autoriza_difusion
        date fecha_consentimiento
    }

    SERVICIO {
        int id_servicio PK
        int id_categoria FK
        int id_comunario FK
        string nombre_servicio
        text descripcion_es
        text descripcion_en
        string comunidad
        string ubicacion_referencial
        string horario_atencion
        string rango_precios
        string idiomas_atencion
        string archivo_imagen
        enum estado_validacion
        int id_autorizacion FK
    }

    ATRACTIVO {
        int id_atractivo PK
        string nombre_es
        string nombre_en
        string categoria
        text descripcion_es
        text descripcion_en
        decimal latitud
        decimal longitud
        int altitud_msnm
        text recomendaciones_es
        text recomendaciones_en
        string archivo_imagen
        enum estado_validacion
        int id_autorizacion FK
    }

    RUTA {
        int id_ruta PK
        string nombre_es
        string nombre_en
        text descripcion_es
        text descripcion_en
        decimal distancia_km
        string duracion_horas
        enum dificultad
        int desnivel_metros
        text recomendaciones_seguridad_es
        text recomendaciones_seguridad_en
        string archivo_imagen
        enum estado_validacion
        int id_autorizacion FK
    }

    RECOMENDACION {
        int id_recomendacion PK
        string categoria
        string icono
        string titulo_es
        string titulo_en
        text descripcion_es
        text descripcion_en
        text consejo_practico_es
        text consejo_practico_en
        int prioridad
        enum estado_validacion
        int id_autorizacion FK
    }

    INTERACCION {
        bigint id_interaccion PK
        string tipo_consulta
        int id_recurso
        string nombre_recurso
        string idioma
        timestamp fecha_hora
    }
```

---

## 2. Normalización del Modelo a Tercera Forma Normal (3FN)

El diseño cumple estrictamente con las reglas de normalización relacional:

1. **Primera Forma Normal (1FN):**
   - Todos los atributos son atómicos; no existen listas ni grupos repetitivos incrustados dentro de columnas individuales (por ejemplo, los idiomas de traducción no se concatenan con separadores arbitrarios, sino que residen en la entidad débil `contenido_idioma`).
   - Cada tabla posee una clave primaria simple (`PRIMARY KEY`) unívoca.

2. **Segunda Forma Normal (2FN):**
   - Cumple la 1FN y cada atributo no clave depende funcionalmente de la totalidad de la clave primaria, eliminando dependencias parciales.
   - En `contenido_idioma`, la clave compuesta lógica `(id_contenido, id_idioma)` determina con precisión los textos traducidos para esa tupla específica.

3. **Tercera Forma Normal (3FN):**
   - Cumple la 2FN y no existen dependencias funcionales transitivas entre atributos que no sean clave.
   - La información de categorías (`categoria_servicio`), comunarios (`comunario`) y autorizaciones (`autorizacion`) se encuentra extraída a sus propias entidades independientes, evitando anomalías de inserción, actualización y borrado.

---

## 3. Diccionario de Datos Sintético

| Tabla | Clave Primaria | Claves Foráneas | Propósito en el Sistema |
|---|---|---|---|
| `usuario` | `id_usuario` | `id_rol` | Credenciales administrativas con hash PBKDF2 y roles de acceso. |
| `rol` | `id_rol` | Ninguna | Perfiles de usuario (ADMINISTRADOR, GESTOR_COMUNITARIO). |
| `idioma` | `id_idioma` | Ninguna | Catálogo de idiomas soportados (es: Español, en: English). |
| `autorizacion` | `id_autorizacion` | Ninguna | Registro documental de convenios y consentimientos informados. |
| `contenido` | `id_contenido` | `id_autorizacion` | Entidad base de contenidos (compatibilidad retroactiva con versión anterior). |
| `contenido_idioma` | `id_contenido_idioma` | `id_contenido`, `id_idioma` | Títulos y descripciones bilingües con datos curiosos. |
| `especie_detalle` | `id_especie` | `id_contenido` | Metadatos biológicos, endemismo, imágenes y audios (.mp3). |
| `categoria_servicio` | `id_categoria` | Ninguna | Tipología de servicios (alojamiento, alimentación, guiado, ecoturismo). |
| `comunario` | `id_comunario` | Ninguna | Datos de prestadores comunitarios con registro de consentimiento. |
| `servicio` | `id_servicio` | `id_categoria`, `id_comunario`, `id_autorizacion` | Oferta turística comunitaria verificada. |
| `atractivo` | `id_atractivo` | `id_autorizacion` | Sitios naturales, arqueológicos y miradores de Cotapata. |
| `ruta` | `id_ruta` | `id_autorizacion` | Senderos técnicos de trekking con especificaciones de seguridad. |
| `recomendacion` | `id_recomendacion` | `id_autorizacion` | Pautas de visita responsable (Código del Viajero). |
| `interaccion` | `id_interaccion` | Ninguna | Métricas agregadas de uso anónimo para evaluación del prototipo. |
