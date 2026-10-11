import type { QuoteFormState } from '../types';
import { apiRequest } from './api';

export async function submitInquiry(formData: QuoteFormState): Promise<string> {
  const result = await apiRequest<{ id: string }>('/v1/inquiries', {
    method: 'POST', body: JSON.stringify(formData),
  });
  return result.id;
}
