# Tarea 03: Captura, almacenamiento y eliminación de fotografías en Android

## 1. Descripción

Para la realización del presente deber, se realizaron modificaciones en la aplicación desarrollada con Ionic y Capacitor con el objetivo de capturar fotografías desde la aplicación, guardarlas en la galería del dispositivo Android y permitir su eliminación desde la interfaz de usuario.

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

Este método permite llamar al servicio `photoService`, que se encarga de abrir la cámara, capturar la fotografía y solicitar que se guarde en la galería del dispositivo.

### 2.3. Permisos de Android

En el archivo `AndroidManifest.xml` se agregaron los siguientes permisos:

```xml
<uses-permission
    android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />

<uses-permission
    android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="29" />

<uses-permission
    android:name="android.permission.READ_MEDIA_IMAGES" />
```

Estos permisos corresponden a diferentes versiones de Android:

- **`READ_EXTERNAL_STORAGE`**: permite leer archivos del almacenamiento externo en las versiones de Android indicadas por `maxSdkVersion`.
- **`WRITE_EXTERNAL_STORAGE`**: permite escribir en el almacenamiento externo en las versiones de Android indicadas por `maxSdkVersion`.
- **`READ_MEDIA_IMAGES`**: permite solicitar acceso de lectura a imágenes en Android 13 y versiones posteriores compatibles.

El acceso efectivo depende de la versión de Android, los permisos concedidos y la forma en que la aplicación administra las imágenes.

### 2.4. Implementación de la opción para eliminar fotografías

Para incorporar la opción de eliminar fotografías, se agregó el método `showActionSheet()` en el componente de la aplicación. Este método muestra un menú con las opciones **Eliminar** y **Cancelar** cuando el usuario desea realizar una acción sobre una fotografía.

```typescript
public async showActionSheet(
  photo: UserPhoto,
  position: number
) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Fotos',
    buttons: [
      {
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePhoto(position);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // No hace nada, solo cierra el menu
        }
      }
    ]
  });

  await actionSheet.present();
}
```

Las principales funciones de este método son:

- **`actionSheetController.create()`**: crea un menú de acciones.
- **`header: 'Fotos'`**: establece el título del menú.
- **`text: 'Eliminar'`**: presenta la opción para eliminar la fotografía seleccionada.
- **`role: 'destructive'`**: identifica la acción como destructiva.
- **`icon: 'trash'`**: muestra un icono de papelera.
- **`this.photoService.deletePhoto(position)`**: llama al servicio encargado de eliminar la fotografía de la lista.
- **`text: 'Cancelar'`**: permite cerrar el menú sin ejecutar la eliminación.
- **`actionSheet.present()`**: muestra el menú en pantalla.

### 2.5. Método para eliminar fotografías del servicio

En el archivo `photo.service.ts` se agregó el método `deletePhoto()`, encargado de actualizar la lista de fotografías y excluir la imagen seleccionada.

```typescript
public async deletePhoto(position: number) {
  this.photos.update((photos) =>
    photos.filter((_, index) => index !== position)
  );
}
```

Este método funciona de la siguiente manera:

- **`position`**: recibe la posición de la fotografía que se desea eliminar.
- **`this.photos.update()`**: actualiza la lista de fotografías almacenada en el servicio.
- **`photos.filter()`**: crea una nueva lista que contiene únicamente las fotografías que cumplen la condición indicada.
- **`index !== position`**: conserva todas las fotografías excepto la que se encuentra en la posición seleccionada.

De esta manera, la fotografía desaparece de la lista que se muestra en la aplicación sin necesidad de modificar manualmente los demás elementos.

## 3. Evidencias de funcionamiento

### 3.1. Aplicación abierta

En la siguiente imagen se muestra la aplicación ejecutándose en el dispositivo Android.

<img width="301" alt="Aplicación abierta" src="https://github.com/user-attachments/assets/de41af00-63e2-440c-a4ea-d698e7ba2913" />

### 3.2. Fotografía tomada desde la aplicación

Se presenta la fotografía capturada utilizando la cámara desde la aplicación desarrollada.

<img width="296" alt="Fotografía tomada desde la aplicación" src="https://github.com/user-attachments/assets/f960fc11-5f6f-4cc1-a886-d219514e1469" />

### 3.3. Fotografía guardada en la galería del celular

En esta evidencia se muestra la fotografía guardada en la galería del dispositivo Android.

<img width="312" alt="Fotografía guardada en la galería" src="https://github.com/user-attachments/assets/419ceac8-3361-4370-8b08-2bc8b542627a" />

### 3.4. Características de la fotografía tomada desde la aplicación

Se muestran las propiedades y características del archivo de imagen obtenido mediante la aplicación.

<img width="332" alt="Características de la fotografía tomada desde la aplicación" src="https://github.com/user-attachments/assets/79c30a25-3c4e-4999-878d-8413c436bde8" />

### 3.5. Características de una fotografía tomada con la cámara del celular

Como referencia, se presentan las características de una fotografía tomada directamente con la cámara del dispositivo para comparar sus propiedades con las de la imagen obtenida mediante la aplicación.

<img width="347" alt="Características de una fotografía tomada con la cámara del celular" src="https://github.com/user-attachments/assets/d8cf42ae-2ed8-4d78-a6fd-c3d665ee9700" />

### 3.6. Funcionamiento de la opción para eliminar fotografías

En la siguiente evidencia se muestra el funcionamiento de la opción para eliminar una fotografía desde el menú de acciones de la aplicación.

<img width="330" alt="Evidencia de la opción para eliminar fotografías" src="https://github.com/user-attachments/assets/61db119c-9dd4-40b6-a070-1e3a05eedc84" />

## 4. Conclusión

Se implementaron funcionalidades para capturar fotografías, solicitar su almacenamiento en la galería del dispositivo Android y administrar las imágenes mostradas en la aplicación.

Además, se incorporó un menú de acciones que permite seleccionar la opción de eliminar o cancelar, junto con un método en el servicio para actualizar la lista de fotografías. Finalmente, se presentaron evidencias del funcionamiento de la captura, el almacenamiento y la eliminación de imágenes desde la interfaz de la aplicación.

##APK
[Camara.zip](https://github.com/user-attachments/files/33703915/Camara.zip)

