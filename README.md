# Sistemas de la Tierra – Interactivo (actividades en JSON)

Este proyecto carga **actividades interactivas** desde archivos **JSON** por sistema (pensado para GitHub Pages, sin backend).

## Estructura
```
.
├─ index.html
├─ styles.css
├─ app.js
└─ assets/
   ├─ atmosfera.jpg  | atmosfera.pdf
   ├─ hidrosfera.jpg | hidrosfera.pdf
   ├─ geosfera.jpg   | geosfera.pdf
   ├─ biosfera.jpg   | biosfera.pdf
   └─ actividades/
      ├─ atmosfera.json
      ├─ hidrosfera.json
      ├─ geosfera.json
      └─ biosfera.json
```

## Formato de actividades (JSON)
Cada archivo JSON debe ser un **array** de actividades. Tipos soportados:

### 1) Opción múltiple (`multiple`)
```json
{
  "type": "multiple",
  "titulo": "Capas de la atmósfera",
  "descripcion": "¿En qué capa se encuentra la mayor parte del clima?",
  "pregunta": "La mayor parte de los fenómenos meteorológicos ocurren en...",
  "opciones": [
    { "texto": "Estratosfera", "correcta": false },
    { "texto": "Mesosfera",   "correcta": false },
    { "texto": "Troposfera",  "correcta": true  },
    { "texto": "Termosfera",  "correcta": false }
  ]
}
```

### 2) Verdadero/Falso (`truefalse`)
```json
{
  "type": "truefalse",
  "titulo": "Ozono",
  "afirmacion": "La capa de ozono se encuentra principalmente en la estratosfera.",
  "correcta": true
}
```

### 3) Ordenar pasos (`order`)
```json
{
  "type": "order",
  "titulo": "Ciclo del agua",
  "descripcion": "Ordena las etapas principales del ciclo del agua.",
  "pasos": ["Evaporación", "Condensación", "Precipitación", "Escorrentía/Infiltración"]
}
```

> **Nota**: Los archivos deben ser **JSON válidos** (comillas dobles, `true/false/null` en minúscula, sin comentarios).

## Dónde editar
- Edita los archivos en `assets/actividades/*.json` para cambiar/agregar actividades por sistema.
- No es necesario tocar el código JS para actualizar el contenido.

## Publicación en GitHub Pages
1. Sube todo el contenido al repositorio (raíz).
2. En **Settings → Pages**: Source = `Deploy from a branch`, `main`, folder `/ (root)`.
3. Espera 1–2 minutos y abre la URL que muestra **Pages**.

## Problemas comunes
- **404** en recursos: verifica nombres y rutas exactas (sensible a may/min).
- **JSON inválido**: usa un validador JSON si es necesario.
- **Caché**: prueba en ventana privada o presiona Ctrl+F5.
