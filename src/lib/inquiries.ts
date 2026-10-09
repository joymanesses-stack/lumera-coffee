import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import type { QuoteFormState } from '../types';
import { requireFirebase } from './firebase';

export async function submitInquiry(formData: QuoteFormState): Promise<string> {
  const { db } = requireFirebase();
  const inquiry = await addDoc(collection(db, 'inquiries'), {
    ...formData,
    status: 'new',
    createdAt: serverTimestamp(),
  });

  return inquiry.id;
}
