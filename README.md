# Tarea 03: Captura y almacenamiento de fotografías en Android

## 1. Descripción

Para la realización del presente deber, se realizaron modificaciones en la aplicación desarrollada con Ionic y Capacitor con el objetivo de capturar fotografías desde la aplicación y guardarlas en la galería del dispositivo Android.

## 2. Modificaciones realizadas

### 2.1. Configuración de la cámara y almacenamiento de fotografías

En el archivo `photo.service.ts`, dentro del método `addNewToGallery()`, se agregaron las siguientes propiedades para configurar la captura y el almacenamiento de las fotografías.

```typescript
public async addNewToGallery() {
  // Toma la fotografia
  const capturedPhoto = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 85, // Define la calidad de la fotografia de 0 a 100
    width: 1600, // Establece el ancho de la fotografia en pixeles
    correctOrientation: true, // Corrige la orientacion de la fotografia
    saveToGallery: true, // Indica que la fotografia debe guardarse en la galeria
  });

  this.photos.update((photos) => [
    {
      filepath: capturedPhoto.path ?? 'soon...', // Guarda la ruta del archivo
      webviewPath: capturedPhoto.webPath!, // Permite mostrar la fotografia en la aplicacion
    },
    ...photos,
  ]);
}
```

Las propiedades agregadas cumplen las siguientes funciones:

- **`quality: 85`**: establece la calidad de la fotografía en un valor de 85 sobre 100.
- **`width: 1600`**: establece un ancho de 1600 píxeles para la imagen resultante.
- **`correctOrientation: true`**: permite corregir la orientación de la fotografía.
- **`saveToGallery: true`**: solicita guardar la fotografía en la galería del dispositivo.
- **`filepath`**: almacena la ruta del archivo de la fotografía.
- **`webviewPath`**: contiene la dirección utilizada para mostrar la fotografía dentro de la aplicación.

### 2.2. Llamada al método para guardar fotografías

Se agregó el método `addPhotoToGallery()` en el componente de la aplicación para llamar a la función encargada de capturar y guardar las fotografías.

```typescript
async addPhotoToGallery() {
  await this.photoService.addNewToGallery();
}
```

Este método cumple las siguientes funciones:

- **`async`**: permite trabajar con operaciones asíncronas.
- **`await`**: espera a que finalice la operación antes de continuar.
- **`this.photoService.addNewToGallery()`**: llama al método del servicio `photoService`, encargado de abrir la cámara, capturar la fotografía y solicitar que se guarde en la galería.

De esta manera, el componente utiliza el servicio de fotografías sin tener que repetir toda la lógica de captura y almacenamiento.

### 2.3. Permisos de Android

Se agregaron los siguientes permisos en el archivo `AndroidManifest.xml`:

```xml
<uses-permission
    android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />

<uses-permission
    android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="29" />
```

Estos permisos permiten el acceso de lectura y escritura al almacenamiento externo en las versiones de Android indicadas. En versiones más recientes, el acceso a los archivos se gestiona de manera diferente.

## 3. Evidencias de funcionamiento

### 3.1. Aplicación abierta

En la siguiente imagen se muestra la aplicación ejecutándose en el dispositivo Android.

<img width="301" alt="Aplicación abierta" src="https://github.com/user-attachments/assets/de41af00-63e2-440c-a4ea-d698e7ba2913" />

### 3.2. Fotografía tomada desde la aplicación

Se presenta la fotografía capturada utilizando la cámara desde la aplicación desarrollada.

<img width="296" alt="Fotografía tomada desde la aplicación" src="https://github.com/user-attachments/assets/f960fc11-5f6f-4cc1-a886-d219514e1469" />

### 3.3. Fotografía guardada en la galería del celular

En esta evidencia se verifica que la fotografía también se encuentra guardada en la galería del dispositivo Android.

<img width="312" alt="Fotografía guardada en la galería" src="https://github.com/user-attachments/assets/419ceac8-3361-4370-8b08-2bc8b542627a" />

### 3.4. Características de la fotografía tomada desde la aplicación

Se muestran las propiedades y características del archivo de imagen obtenido mediante la aplicación.

<img width="332" alt="Características de la fotografía tomada desde la aplicación" src="https://github.com/user-attachments/assets/79c30a25-3c4e-4999-878d-8413c436bde8" />

### 3.5. Características de una fotografía tomada con la cámara del celular

Como referencia, se presentan las características de una fotografía tomada directamente con la cámara del dispositivo, para comparar sus propiedades con las de la imagen obtenida mediante la aplicación.

<img width="347" alt="Características de una fotografía tomada con la cámara del celular" src="https://github.com/user-attachments/assets/d8cf42ae-2ed8-4d78-a6fd-c3d665ee9700" />

## 4. Conclusión

Se realizaron modificaciones en el servicio de fotografías y en el componente de la aplicación para configurar la captura de imágenes y solicitar su almacenamiento en la galería del dispositivo Android.


 ____ 
APK: [camara.zip](https://github.com/user-attachments/files/33645305/camara.zip)
