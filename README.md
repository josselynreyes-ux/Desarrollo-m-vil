# Tarea 03: Captura y almacenamiento de fotografías en Android

## 1. Descripción

Para la realización del presente deber, se realizaron modificaciones en el archivo `photo.service.ts` de la aplicación desarrollada con Ionic y Capacitor. El objetivo fue configurar la captura de fotografías y permitir que las imágenes tomadas desde la aplicación se guarden en la galería del dispositivo Android.

## 2. Modificaciones realizadas

### 2.1. Configuración de la cámara

En el método `addNewToGallery()` del archivo `photo.service.ts` se agregaron las siguientes propiedades para configurar la captura y el almacenamiento de las fotografías.

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

### 2.2. Permisos de Android

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

<img width="332" alt="Características de la fotografía de la aplicación" src="https://github.com/user-attachments/assets/79c30a25-3c4e-4999-878d-8413c436bde8" />

### 3.5. Características de una fotografía tomada con la cámara del celular

Como referencia, se presentan las características de una fotografía tomada directamente con la cámara del dispositivo, para comparar sus propiedades con las de la imagen obtenida mediante la aplicación.

<img width="347" alt="Características de una fotografía tomada con la cámara del celular" src="https://github.com/user-attachments/assets/d8cf42ae-2ed8-4d78-a6fd-c3d665ee9700" />

## 4. Conclusión

Se realizaron modificaciones en el servicio de fotografías de la aplicación para configurar la captura de imágenes y solicitar su almacenamiento en la galería del dispositivo Android. Además, se presentaron evidencias del funcionamiento de la aplicación y de las características de las fotografías obtenidas.


 ____ 
APK: [camara.zip](https://github.com/user-attachments/files/33645305/camara.zip)
