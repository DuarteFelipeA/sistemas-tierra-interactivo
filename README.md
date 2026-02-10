# Sistemas de la Tierra – Interactivo (JSON extendido, **modo intento único**)

Este paquete incluye **todos los tipos de actividades** y **bloqueo tras el primer intento**:

**Tipos soportados**: `multiple`, `truefalse`, `order`, `match`, `cloze`, `hotspots`, `bank`.

**Intento único**: al presionar **Comprobar**, se registra la resolución en `localStorage` con clave `act_lock::<sistema>::<ruta>` y la interfaz queda **deshabilitada** (sin botón Reiniciar). Al reabrir, se muestra **"Intento ya realizado"**.

> Nota: el bloqueo es por **navegador/dispositivo** (localStorage). Para permitir nuevos intentos, el docente puede borrar el almacenamiento del sitio o modificar el índice/orden de las actividades en el JSON (cambia la clave lógica).

## Publicación rápida (GitHub Pages)
1) Sube todos los archivos a la raíz del repositorio.  
2) **Settings → Pages**: `Deploy from a branch` → `main` → `/ (root)`.  
3) Espera 1–2 minutos y abre la URL de Pages.

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
   ├─ hotspots_rio.jpg
   └─ actividades/
      ├─ atmosfera.json
      ├─ hidrosfera.json
      ├─ geosfera.json
      └─ biosfera.json
```

## Formatos JSON (resumen)
- **multiple**: `pregunta`, `opciones:[{texto,correcta}]`  
- **truefalse**: `afirmacion`, `correcta:true/false`  
- **order**: `pasos:[...]`  
- **match**: `pares:[{a,b},...]`  
- **cloze**: `texto:"... {{respuesta|alternativa}} ..."`  
- **hotspots**: `imagen`, `zones:[{x,y,w,h,label}]` en **%**, `labels:[...]`  
- **bank**: `n`, `items:[actividades mixtas]`  
