
'use client';

import { useUser } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, getFirestore } from 'firebase/firestore';
import { useMemo } from 'react';

export const useAdmin = () => {
  const { user, isUserLoading: isUserLoading } = useUser();
  const firestore = getFirestore();

  const adminDocRef = useMemo(() => {
    if (user?.uid) {
      return doc(firestore, 'roles_admin', user.uid);
    }
    return null;
  }, [user?.uid, firestore]);

  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminDocRef);

  const isAdmin = !!adminDoc;
  const isLoading = isUserLoading || isAdminDocLoading;

  return { isAdmin, isLoading };
};
