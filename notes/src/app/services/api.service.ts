import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User as FirebaseUser, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Firestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface Blueprint {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // Authentication Methods
  async registerUser(email: string, password: string, name: string): Promise<User> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      const now = new Date();
      const user: User = {
        id: credential.user.uid,
        email: email,
        name: name,
        created_at: now,
        updated_at: now
      };

      // Store user profile in Firestore
      await setDoc(doc(this.firestore, 'users', user.id), {
        email: user.email,
        name: user.name,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string): Promise<User> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const userDoc = await getDoc(doc(this.firestore, 'users', credential.user.uid));

      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: credential.user.uid,
          email: data['email'],
          name: data['name'],
          created_at: data['created_at']?.toDate() || new Date(),
          updated_at: data['updated_at']?.toDate() || new Date()
        } as User;
      }

      throw new Error('User profile not found');
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);

      // Check if user profile exists in Firestore
      const userDoc = await getDoc(doc(this.firestore, 'users', credential.user.uid));

      if (userDoc.exists()) {
        // User exists, return their profile
        const data = userDoc.data();
        return {
          id: credential.user.uid,
          email: data['email'],
          name: data['name'],
          created_at: data['created_at']?.toDate() || new Date(),
          updated_at: data['updated_at']?.toDate() || new Date()
        } as User;
      } else {
        // New user, create profile in Firestore
        const name = credential.user.displayName || credential.user.email?.split('@')[0] || 'User';
        const email = credential.user.email || '';

        await setDoc(doc(this.firestore, 'users', credential.user.uid), {
          email: email,
          name: name,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });

        return {
          id: credential.user.uid,
          email: email,
          name: name,
          created_at: new Date(),
          updated_at: new Date()
        } as User;
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          email: data['email'],
          name: data['name'],
          created_at: data['created_at']?.toDate() || new Date(),
          updated_at: data['updated_at']?.toDate() || new Date()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, orderBy('created_at', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data['email'],
          name: data['name'],
          created_at: data['created_at']?.toDate() || new Date(),
          updated_at: data['updated_at']?.toDate() || new Date()
        } as User;
      });
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Notes Methods
  async getNotes(userId: string): Promise<Note[]> {
    try {
      const notesCollection = collection(this.firestore, 'notes');
      const q = query(notesCollection, where('user_id', '==', userId), orderBy('updated_at', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          user_id: data['user_id'],
          title: data['title'],
          content: data['content'],
          created_at: data['created_at']?.toDate() || new Date(),
          updated_at: data['updated_at']?.toDate() || new Date()
        } as Note;
      });
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  }

  async createNote(userId: string, title: string, content: string): Promise<string> {
    try {
      const notesCollection = collection(this.firestore, 'notes');
      const docRef = await addDoc(notesCollection, {
        user_id: userId,
        title: title,
        content: content,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async updateNote(noteId: string, title: string, content: string): Promise<void> {
    try {
      const noteRef = doc(this.firestore, 'notes', noteId);
      await updateDoc(noteRef, {
        title: title,
        content: content,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'notes', noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  // Blueprints Methods
  async getBlueprints(userId: string): Promise<Blueprint[]> {
    try {
      const blueprintsCollection = collection(this.firestore, 'blueprints');
      const q = query(blueprintsCollection, where('user_id', '==', userId), orderBy('updated_at', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          user_id: data['user_id'],
          title: data['title'],
          content: data['content'],
          created_at: data['created_at']?.toDate() || new Date(),
          updated_at: data['updated_at']?.toDate() || new Date()
        } as Blueprint;
      });
    } catch (error) {
      console.error('Error getting blueprints:', error);
      throw error;
    }
  }

  async createBlueprint(userId: string, title: string, content: string): Promise<string> {
    try {
      const blueprintsCollection = collection(this.firestore, 'blueprints');
      const docRef = await addDoc(blueprintsCollection, {
        user_id: userId,
        title: title,
        content: content,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating blueprint:', error);
      throw error;
    }
  }

  async updateBlueprint(blueprintId: string, title: string, content: string): Promise<void> {
    try {
      const blueprintRef = doc(this.firestore, 'blueprints', blueprintId);
      await updateDoc(blueprintRef, {
        title: title,
        content: content,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating blueprint:', error);
      throw error;
    }
  }

  async deleteBlueprint(blueprintId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'blueprints', blueprintId));
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      throw error;
    }
  }
}
