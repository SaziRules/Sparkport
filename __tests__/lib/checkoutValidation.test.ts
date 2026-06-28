import { describe, it, expect } from 'vitest';
import { validateCheckoutForm } from '@/lib/checkoutValidation';
import type { CheckoutFormData } from '@/lib/checkoutValidation';

const VALID_FORM: CheckoutFormData = {
  firstName: 'Sipho',
  lastName: 'Dlamini',
  email: 'sipho@example.com',
  phone: '0831234567',
  address1: '12 Main Road',
  address2: '',
  city: 'Durban',
  province: 'KwaZulu-Natal',
  postcode: '4001',
  orderNotes: '',
};

describe('validateCheckoutForm', () => {
  it('returns no errors for a valid form', () => {
    expect(validateCheckoutForm(VALID_FORM)).toEqual({});
  });

  it('requires first name', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, firstName: '' });
    expect(errors.firstName).toBeTruthy();
  });

  it('requires last name', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, lastName: '  ' });
    expect(errors.lastName).toBeTruthy();
  });

  it('requires email', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, email: '' });
    expect(errors.email).toBeTruthy();
  });

  it('rejects an invalid email format', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, email: 'notanemail' });
    expect(errors.email).toBeTruthy();
  });

  it('requires phone', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, phone: '' });
    expect(errors.phone).toBeTruthy();
  });

  it('requires address line 1', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, address1: '' });
    expect(errors.address1).toBeTruthy();
  });

  it('requires city', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, city: '' });
    expect(errors.city).toBeTruthy();
  });

  it('requires province selection', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, province: '' });
    expect(errors.province).toBeTruthy();
  });

  it('requires postal code', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, postcode: '' });
    expect(errors.postcode).toBeTruthy();
  });

  it('does not require address2 or orderNotes', () => {
    const errors = validateCheckoutForm({ ...VALID_FORM, address2: '', orderNotes: '' });
    expect(errors.address2).toBeFalsy();
    expect(errors.orderNotes).toBeFalsy();
  });
});
