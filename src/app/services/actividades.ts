import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Firestore
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Actividad {
  id?: string;
  titulo: string;
  descripcion: string;
  tipo: 'Tarea' | 'Proyecto' | 'Examen' | 'Investigación' | 'Taller';
  fechaEntrega: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  completada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private db: Firestore;
  private coleccionNombre = 'actividades';

  constructor() {
    // Inicializar Firebase de forma segura evitando duplicados
    const app = getApps().length === 0 ? initializeApp(environment.firebaseConfig) : getApp();
    this.db = getFirestore(app);
  }

  // 1. CREAR: Guardar actividad en Firestore
  crearActividad(actividad: Omit<Actividad, 'id'>) {
    const colRef = collection(this.db, this.coleccionNombre);
    return addDoc(colRef, actividad);
  }

  // 2. LEER: Obtener actividades en tiempo real
  obtenerActividades(): Observable<Actividad[]> {
    return new Observable((observer) => {
      const colRef = collection(this.db, this.coleccionNombre);
      const q = query(colRef, orderBy('fechaEntrega', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const actividades: Actividad[] = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...(documento.data() as Omit<Actividad, 'id'>)
          }));
          observer.next(actividades);
        },
        (error) => {
          observer.error(error);
        }
      );

      // Limpiar listener cuando se destruye la suscripción
      return () => unsubscribe();
    });
  }

  // 3. ACTUALIZAR: Marcar como completada o pendiente
  actualizarEstado(id: string, completada: boolean) {
    const docRef = doc(this.db, `${this.coleccionNombre}/${id}`);
    return updateDoc(docRef, { completada });
  }

  // 4. ELIMINAR: Borrar actividad
  eliminarActividad(id: string) {
    const docRef = doc(this.db, `${this.coleccionNombre}/${id}`);
    return deleteDoc(docRef);
  }
}