export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postcode: string;
  orderNotes: string;
}

export type FormErrors = Partial<Record<keyof CheckoutFormData, string>>;

export function validateCheckoutForm(
  form: CheckoutFormData,
  options?: { isInStore?: boolean }
): FormErrors {
  const errors: FormErrors = {};
  const isInStore = options?.isInStore ?? false;

  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required';

  if (!isInStore) {
    if (!form.address1.trim()) errors.address1 = 'Address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.province) errors.province = 'Please select a province';
    if (!form.postcode.trim()) errors.postcode = 'Postal code is required';
  }

  return errors;
}

export type BillingData = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postcode: string;
};

export type BillingErrors = Partial<Record<keyof BillingData, string>>;

export function validateBillingData(b: BillingData): BillingErrors {
  const errors: BillingErrors = {};
  if (!b.firstName.trim()) errors.firstName = 'First name is required';
  if (!b.lastName.trim())  errors.lastName  = 'Last name is required';
  if (!b.address1.trim())  errors.address1  = 'Address is required';
  if (!b.city.trim())      errors.city      = 'City is required';
  if (!b.province)         errors.province  = 'Please select a province';
  if (!b.postcode.trim())  errors.postcode  = 'Postal code is required';
  return errors;
}
