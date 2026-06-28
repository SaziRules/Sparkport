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

export function validateCheckoutForm(form: CheckoutFormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required';
  if (!form.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  if (!form.address1.trim()) errors.address1 = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.province) errors.province = 'Please select a province';
  if (!form.postcode.trim()) errors.postcode = 'Postal code is required';
  return errors;
}
