export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  slug: string;
  area: string;
  content: {
    gettingHere: string;
    seoWriteUp: string;
  };
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
    slug: 'quality-street',
    area: 'Jacobs, Durban',
    content: {
      gettingHere:
        'Located on Quality Street in Jacobs, directly accessible from the M4 South Coast Road. Street parking is available directly outside the pharmacy. The branch is well signposted and situated near several industrial and residential estates in the South Durban Basin.',
      seoWriteUp:
        'Sparkport Quality Street is a full-service community pharmacy serving the industrial and residential areas of Jacobs, Bluff, Merebank, and Wentworth in the South Durban Basin. Our compact, professionally staffed dispensary is known for fast script turnaround and knowledgeable pharmacist consultations.\n\nWe dispense both acute and chronic prescriptions, stock a comprehensive range of over-the-counter medicines, vitamins, and health supplements, and offer in-store pharmacist advice. Our team is experienced in handling Schedule 5 and Schedule 6 medications in full compliance with SAHPRA regulations and the Medicines Act.\n\nOnline prescription submissions are supported — simply upload your script via our website and select Quality Street as your preferred collection branch. We will contact you when your medication is ready for collection.\n\nWhether you live in Jacobs, work in the nearby industrial corridor, or are passing through the South Durban Basin, Sparkport Quality Street offers the professional pharmacy service you can rely on. We are committed to accessible, high-quality pharmaceutical care for every member of our community.',
    },
  },
  {
    id: '2',
    name: 'Sparkport Musgrave',
    address: '77 Musgrave Rd, Musgrave, Berea, 4001',
    phone: '(031) 201-8121',
    email: 'clinic.musgrave@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-6PM • Fri: 8AM-6PM • Sat: 8AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8389, lng: 30.9987 },
    slug: 'musgrave',
    area: 'Berea, Durban',
    content: {
      gettingHere:
        'Situated on Musgrave Road on the Berea ridge, easily accessible from the M13 and Florida Road interchange. Metered street parking and nearby paid parking facilities are available. The branch is within walking distance of Musgrave Centre and several medical suites.',
      seoWriteUp:
        'Sparkport Musgrave serves the cosmopolitan Berea ridge corridor — students, young professionals, and the established residential community of Musgrave, Glenwood, and Morningside. Our walk-in friendly dispensary is staffed by experienced pharmacists who take time to counsel patients on their medication.\n\nWe provide full dispensary services for acute and chronic prescriptions, a broad OTC product range, and specialist advice on chronic disease management. Our pharmacy is convenient to nearby medical practices and specialist consulting rooms, making us a natural choice for patients collecting prescriptions immediately after a consultation.\n\nChronic medication management is a specialty at this branch — we work with patients to ensure repeat prescriptions are refilled on time and that dosing schedules are maintained. Online ordering with in-store collection at Musgrave is available through the Sparkport website.\n\nSparkport Musgrave is dedicated to providing professional, personable pharmaceutical care to one of Durban\'s most vibrant and diverse communities. Our team understands the needs of both long-term residents and the transient student population, offering guidance on a wide range of health and wellness products.',
    },
  },
  {
    id: '3',
    name: 'Sparkport Warner Beach',
    address: '125 Kingsway St, Warner Beach, Kingsburgh, 4126',
    phone: '(031) 916-6550',
    email: 'warnerbeach@sparkport.co.za',
    hours: 'Mon-Thu: 8:30AM-5:30PM • Fri: 8:30AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -30.0850, lng: 30.8567 },
    slug: 'warner-beach',
    area: 'Kingsburgh, KZN South Coast',
    content: {
      gettingHere:
        'Located on Kingsway Street in Warner Beach, conveniently placed along the main road serving the coastal suburbs south of Durban. Ample parking is available outside the branch. Easily reached from the N2 South via the Warner Beach off-ramp.',
      seoWriteUp:
        'Sparkport Warner Beach is a community pharmacy serving the coastal suburbs of Warner Beach, Winkelspruit, Illovo Beach, and the wider Kingsburgh corridor along the KwaZulu-Natal South Coast. Our relaxed, seaside setting belies a full-service dispensary equipped to handle the full spectrum of pharmacy needs.\n\nWe dispense both acute and chronic prescriptions and carry a comprehensive wellness product range including vitamins, supplements, skincare, and baby products. Our pharmacists are available for consultation during all trading hours and provide guidance on chronic disease management, including hypertension, diabetes, and respiratory conditions.\n\nScript uploads via the Sparkport website are fully supported — submit your prescription online and select Warner Beach as your collection branch. Our team will process your script and notify you when it is ready.\n\nSparkport Warner Beach is proud to serve a community that values quality healthcare in a convenient coastal location. Whether you are a long-time resident or a visitor to the South Coast, we are here to ensure your pharmacy needs are met with professionalism and care.',
    },
  },
  {
    id: '4',
    name: 'Sparkport Chatsworth',
    address: 'Shop 3, Ayesha Centre, 50 Tranquil St, Chatsworth, 4092',
    phone: '(031) 401-0010',
    email: 'chatsdispensary@sparkport.co.za',
    hours: 'Mon-Sun: 9AM-8PM • Fri: 9AM-6PM',
    coordinates: { lat: -29.9197, lng: 30.8970 },
    slug: 'chatsworth',
    area: 'Chatsworth, Durban',
    content: {
      gettingHere:
        'Located in the Ayesha Centre on Tranquil Street in Chatsworth. The centre offers ample free parking. Accessible from the M7 Chatsworth Road and multiple public transport routes serving the township.',
      seoWriteUp:
        'Sparkport Chatsworth serves one of KwaZulu-Natal\'s largest and most vibrant townships, providing full dispensary services to the communities of Chatsworth, Montford, Woodhurst, and surrounding suburbs. Our high-volume dispensary operates seven days a week with extended trading hours, including Sundays, to ensure medication is always accessible when you need it.\n\nOur experienced pharmacy team handles both acute and chronic prescriptions, with particular expertise in managing long-term chronic conditions common in the Chatsworth community, including hypertension, diabetes, asthma, and HIV/ARV therapy. We carry a full range of OTC medicines, health products, and wellness supplements.\n\nOnline prescription submission is available via the Sparkport website. Simply upload your script, choose Chatsworth as your preferred branch, and we will prepare your medication for collection. Our team will contact you when it is ready.\n\nSparkport Chatsworth is deeply embedded in the community it serves. We understand the importance of accessible, reliable pharmaceutical care for every family, and we are committed to delivering a professional, compassionate service every day of the week.',
    },
  },
  {
    id: '5',
    name: 'Sparkport Umlazi',
    address: 'Shop 4 Ithala Centre, Existing Main Road, Umlazi, 4031',
    phone: '(031) 906-8118',
    email: 'umlazidisp@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-6PM • Fri: 9AM-5PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.9589, lng: 30.8841 },
    slug: 'umlazi',
    area: 'Umlazi, Durban',
    content: {
      gettingHere:
        'Situated in the Ithala Centre on Existing Main Road in Umlazi. The centre has parking available for customers. The branch is accessible via multiple taxi routes and public transport connections serving the township.',
      seoWriteUp:
        'Sparkport Umlazi is a community-focused pharmacy serving Umlazi township and the surrounding areas from our convenient Ithala Centre location. We are known for our accessibility, commitment to community health, and the warm, professional service our team delivers every day.\n\nOur dispensary handles acute and chronic prescriptions, ARV and HIV management, chronic disease monitoring, and a full range of over-the-counter medicines and health products. We work closely with the local community to ensure that medication is dispensed safely, on time, and with proper counselling.\n\nScript submissions via the Sparkport website are supported — upload your prescription online, select Umlazi as your preferred branch, and our team will prepare and notify you when your medication is ready for collection.\n\nAt Sparkport Umlazi, we believe every member of our community deserves access to quality pharmaceutical care. Our team speaks the languages of the community and is committed to providing clear, understandable health information to every patient who walks through our doors.',
    },
  },
  {
    id: '6',
    name: 'Sparkport Pietermaritzburg',
    address: '553 Dr Chota Motala Rd, Raisethorpe, PMB, 3201',
    phone: '(033) 397-0099',
    email: 'dispensary@sparkport.net',
    hours: 'Mon-Sat: 9AM-8PM • Sun: 10AM-6PM',
    coordinates: { lat: -29.6186, lng: 30.3802 },
    slug: 'pietermaritzburg',
    area: 'Pietermaritzburg, KZN',
    content: {
      gettingHere:
        'Located on Dr Chota Motala Road in Raisethorpe, Pietermaritzburg. Street and off-road parking is available in the vicinity. The branch is centrally accessible within the PMB metro, close to major arterial routes serving Raisethorpe and the broader city.',
      seoWriteUp:
        'Sparkport Pietermaritzburg is our inland anchor branch, serving Raisethorpe and the broader Pietermaritzburg metro with extended trading hours seven days a week. As the Msunduzi municipality\'s dedicated Sparkport branch, we provide comprehensive pharmaceutical services to the communities of Raisethorpe, Northdale, and the wider PMB area.\n\nOur experienced team dispenses both acute and chronic prescriptions, manages long-term chronic conditions including diabetes, hypertension, and respiratory disease, and stocks a wide range of OTC medicines, vitamins, and wellness products. Extended Saturday trading until 8PM and Sunday hours until 6PM make us one of the most accessible pharmacies in the city.\n\nScript submissions via the Sparkport website are fully supported. Upload your prescription, select Pietermaritzburg as your preferred collection branch, and our team will notify you when it is ready.\n\nSparkport Pietermaritzburg is committed to raising the standard of pharmaceutical care in the inland KZN region. Our team combines professional expertise with genuine community care to ensure every patient receives the attention and guidance they deserve.',
    },
  },
  {
    id: '7',
    name: 'Sparkport Overport',
    address: 'Corner Moses Kotane & Randles Road, Durban, 4091',
    phone: '(031) 207-1011',
    email: 'dispensary@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-10PM • Fri: 8AM-10PM • Sat: 8AM-10PM • Sun: 9AM-10PM',
    coordinates: { lat: -29.8765, lng: 31.0131 },
    slug: 'overport',
    area: 'Overport, Durban',
    content: {
      gettingHere:
        'The flagship branch is situated on the corner of Moses Kotane Avenue and Randles Road in Overport, easily accessible from the M13. On-street parking is available on both roads. The branch is served by multiple taxi routes and is within walking distance of the Overport City shopping centre.',
      seoWriteUp:
        'Sparkport Overport is our flagship location — the corner of Moses Kotane Avenue and Randles Road in Overport, Durban. We trade seven days a week until 10PM, making us one of the longest-trading pharmacies in KwaZulu-Natal and the go-to option when you need medication late in the evening.\n\nOur full-service dispensary handles everything from everyday acute prescriptions and chronic medication management to Schedule 5 and Schedule 6 controlled substances, all dispensed in strict compliance with SAHPRA and PCSA regulations. We stock an extensive range of OTC medicines, health supplements, skincare, and baby products.\n\nOnline prescription submission is available — upload your script via the Sparkport website, select Overport as your collection branch, and our pharmacist team will process and notify you when it is ready. Given our extended hours, evening collection after a busy day is always possible.\n\nSparkport Overport has been serving the communities of Overport, Sydenham, Essenwood, and surrounding Durban North inner-city suburbs for decades. We are proud of our role as a health anchor in a dynamic, multicultural neighbourhood.',
    },
  },
  {
    id: '8',
    name: 'Sparkport City Centre',
    address: 'Corner Yusuf Dadoo & Anton Lembede St, Durban, 4001',
    phone: '(031) 304-9767',
    email: 'wholesale@sparkport.co.za',
    hours: 'Mon-Thu: 7:30AM-7:30PM • Fri: 7:30AM-7:30PM • Sat: 7:30AM-7PM • Sun: 9AM-4PM',
    coordinates: { lat: -29.8587, lng: 31.0295 },
    slug: 'city-centre',
    area: 'Durban CBD',
    content: {
      gettingHere:
        'Located on the corner of Yusuf Dadoo Street (Grey Street) and Anton Lembede Street in the heart of the Durban CBD. Accessible via the city\'s major arterial routes and within walking distance of the Durban Station taxi rank and bus terminal. Paid parking is available in several nearby facilities.',
      seoWriteUp:
        'Sparkport City Centre is located at the heart of the Durban CBD, on the corner of Yusuf Dadoo Street (Grey Street) and Anton Lembede Street. We open at 7:30AM Monday to Saturday — earlier than most city pharmacies — to serve commuters, business district workers, and early-morning patients before their day begins.\n\nOur full-service dispensary handles acute and chronic prescriptions, with particular experience in serving the diverse and high-volume patient base of the Durban CBD. We stock a comprehensive range of OTC medicines, health products, vitamins, and wholesale enquiries are welcome.\n\nOnline prescription submission is supported — upload your script via the Sparkport website and select City Centre as your preferred collection branch. Given our early opening hours and central location, pre-work collection is a convenient option for many of our patients.\n\nSparkport City Centre has served the commercial heart of Durban for many years. Our central location makes us accessible to residents, workers, and visitors across the city, and our experienced team is equipped to handle high volumes without compromising on the quality of care or counsel provided to each patient.',
    },
  },
];

export function getStoreBySlug(slug: string): Store | undefined {
  return STORES.find((s) => s.slug === slug);
}
