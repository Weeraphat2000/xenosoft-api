import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { Database, getDatabase, ref, set } from 'firebase/database';
import { FirebaseOptions, initializeApp } from 'firebase/app';

@Injectable()
export class FirebaseService {
  public database: Database;
  constructor() {
    const firebaseConfig = {} as FirebaseOptions;
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
