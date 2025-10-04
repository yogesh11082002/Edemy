'use server';

import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export async function claimAdminRole(uid: string) {
    if (!uid) {
        throw new Error('User ID is required to claim admin role.');
    }
    
    // We need to initialize firebase here to get the firestore instance on the server
    const { firestore } = initializeFirebase();

    try {
        const adminRoleRef = doc(firestore, 'roles_admin', uid);
        await setDoc(adminRoleRef, { isAdmin: true });
        return { success: true };
    } catch (error: any) {
        console.error("Error claiming admin role:", error);
        throw new Error(error.message || 'An unknown error occurred while claiming the admin role.');
    }
}
