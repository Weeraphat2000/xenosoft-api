import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { Database, getDatabase, ref, set } from 'firebase/database';
import { FirebaseOptions, initializeApp } from 'firebase/app';

@Injectable()
export class FirebaseService {
  public database: Database;
  constructor() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCWAbR0dnFtauPG3QJezY50_p2DZAkl_qA',
      authDomain: 'xenosoft-8d238.firebaseapp.com',
      projectId: 'xenosoft-8d238',
      storageBucket: 'xenosoft-8d238.appspot.com',
      messagingSenderId: '394602037530',
      appId: '1:394602037530:web:8e24c6eed10b8fca892ca3',
      measurementId: 'G-KJ6YT2QCP4',
      // databaseURL:
    } as FirebaseOptions;
    const app = initializeApp(firebaseConfig);

    this.database = getDatabase(app);
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  async saveOrUpdateRealTime(
    refString: string,
    payload: unknown,
  ): Promise<boolean> {
    try {
      await set(ref(this.database, refString), payload);
      return true;
    } catch (error) {
      console.error('Error saving or updating data:', error);
      return false;
    }
  }
}
