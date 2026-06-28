export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
}

export const STORES: Store[] = [
  {
    id: '1',
    name: 'Sparkport Quality Street',
    address: '315 Quality Street, Jacobs, Durban, 4052',
    phone: '(031) 461-3760',
    email: 'scriptsqs@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-5:30PM • Fri: 9AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8854, lng: 30.9838 },
  },
  {
    id: '2',
    name: 'Sparkport Musgrave',
    address: '77 Musgrave Rd, Musgrave, Berea, 4001',
    phone: '(031) 201-8121',
    email: 'clinic.musgrave@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-6PM • Fri: 8AM-6PM • Sat: 8AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8389, lng: 30.9987 },
  },
  {
    id: '3',
    name: 'Sparkport Warner Beach',
    address: '125 Kingsway St, Warner Beach, Kingsburgh, 4126',
    phone: '(031) 916-6550',
    email: 'warnerbeach@sparkport.co.za',
    hours: 'Mon-Thu: 8:30AM-5:30PM • Fri: 8:30AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -30.0850, lng: 30.8567 },
  },
  {
    id: '4',
    name: 'Sparkport Chatsworth',
    address: 'Shop 3, Ayesha Centre, 50 Tranquil St, Chatsworth, 4092',
    phone: '(031) 401-0010',
    email: 'chatsdispensary@sparkport.co.za',
    hours: 'Mon-Sun: 9AM-8PM • Fri: 9AM-6PM',
    coordinates: { lat: -29.9197, lng: 30.8970 },
  },
  {
    id: '5',
    name: 'Sparkport Umlazi',
    address: 'Shop 4 Ithala Centre, Existing Main Road, Umlazi, 4031',
    phone: '(031) 906-8118',
    email: 'umlazidisp@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-6PM • Fri: 9AM-5PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.9589, lng: 30.8841 },
  },
  {
    id: '6',
    name: 'Sparkport Pietermaritzburg',
    address: '553 Dr Chota Motala Rd, Raisethorpe, PMB, 3201',
    phone: '(033) 397-0099',
    email: 'dispensary@sparkport.net',
    hours: 'Mon-Sat: 9AM-8PM • Sun: 10AM-6PM',
    coordinates: { lat: -29.6186, lng: 30.3802 },
  },
  {
    id: '7',
    name: 'Sparkport Overport',
    address: 'Corner Moses Kotane & Randles Road, Durban, 4091',
    phone: '(031) 207-1011',
    email: 'dispensary@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-10PM • Fri: 8AM-10PM • Sat: 8AM-10PM • Sun: 9AM-10PM',
    coordinates: { lat: -29.8765, lng: 31.0131 },
  },
  {
    id: '8',
    name: 'Sparkport City Centre',
    address: 'Corner Yusuf Dadoo & Anton Lembede St, Durban, 4001',
    phone: '(031) 304-9767',
    email: 'wholesale@sparkport.co.za',
    hours: 'Mon-Thu: 7:30AM-7:30PM • Fri: 7:30AM-7:30PM • Sat: 7:30AM-7PM • Sun: 9AM-4PM',
    coordinates: { lat: -29.8587, lng: 31.0295 },
  },
];
