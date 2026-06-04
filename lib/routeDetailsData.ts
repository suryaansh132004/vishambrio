export type RouteNode = {
  name: string;
  desc: string;
  x: number;
  y: number;
  type: 'start' | 'stop' | 'scenic' | 'end';
  photoIndex?: number;
};

export type RouteDetails = {
  title: string;
  distance: string;
  duration: string;
  baseFare: string;
  pickupVal: string;
  dropVal: string;
  svgPath: string;
  dropPoints: string[];
  photos: string[];
  nodes: RouteNode[];
};

export const routeDetailsData: Record<string, RouteDetails> = {
  'route-1': {
    title: 'Gaggal → Dharamshala',
    distance: '18 km',
    duration: '35 min',
    baseFare: '₹450',
    pickupVal: 'gaggal',
    dropVal: 'dharamshala',
    svgPath: 'M 40 180 C 100 120, 150 200, 200 100 C 240 60, 280 80, 360 60',
    dropPoints: ['Dharamshala Skyway Terminal', 'Kotwali Bazar', 'Dharamshala Bus Stand'],
    photos: ['/assets/palampur_tea.png', '/assets/mcleod_ganj.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point - Flight arrivals & baggage pickup area', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Dharamshala Bypass EV Charger', desc: 'Quick 50kW EV high-speed backup charger station', x: 150, y: 165, type: 'stop', photoIndex: 0 },
      { name: 'Pine Valley Viewpoint', desc: 'Photogenic panoramic overview of lush tea gardens', x: 235, y: 85, type: 'scenic', photoIndex: 0 },
      { name: 'Dharamshala Skyway Terminal', desc: 'Drop Point - Major mountain skyway terminal hub', x: 360, y: 60, type: 'end', photoIndex: 1 }
    ]
  },
  'route-2': {
    title: 'Gaggal → McLeod Ganj',
    distance: '25 km',
    duration: '55 min',
    baseFare: '₹650',
    pickupVal: 'gaggal',
    dropVal: 'mcleodganj',
    svgPath: 'M 40 180 C 80 160, 100 220, 160 140 C 220 60, 240 100, 360 40',
    dropPoints: ['McLeodganj Main Square', 'Bhagsunag Temple Parking', 'Naddi Sunset Viewpoint'],
    photos: ['/assets/mcleod_ganj.png', '/assets/kangra_fort.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point - Flight landing terminal', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Dharamshala Kotwali Bazar', desc: 'Scenic mountain climb gateway and local market entry', x: 130, y: 170, type: 'stop', photoIndex: 0 },
      { name: 'Bhagsunag Pine Forests', desc: 'Lush towering cedar and pine forest overlook', x: 220, y: 85, type: 'scenic', photoIndex: 0 },
      { name: 'McLeodganj Main Square', desc: 'Drop Point - Heart of Tibetan culture and Dalai Lama Temple', x: 360, y: 40, type: 'end', photoIndex: 1 }
    ]
  },
  'route-3': {
    title: 'Gaggal → Chamunda Devi',
    distance: '20 km',
    duration: '45 min',
    baseFare: '₹600',
    pickupVal: 'gaggal',
    dropVal: 'kangra_temple',
    svgPath: 'M 40 180 C 120 180, 160 120, 220 160 C 260 180, 300 120, 360 100',
    dropPoints: ['Chamunda Devi Temple Main Entrance', 'Yatri Niwas Dharamshala Crossing', 'Baner River Bank Parking'],
    photos: ['/assets/baijnath_temple.png', '/assets/masroor_temple.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Kangra Valley View Toll', desc: 'Valley checkpoint with breathtaking mountain backdrops', x: 170, y: 135, type: 'stop', photoIndex: 0 },
      { name: 'Baner River Banks', desc: 'A serene flowing river next to the temple steps', x: 270, y: 140, type: 'scenic', photoIndex: 1 },
      { name: 'Chamunda Devi Temple', desc: 'Drop Point - Famous sacred Shakti Peeth pilgrimage shrine', x: 360, y: 100, type: 'end', photoIndex: 0 }
    ]
  },
  'route-4': {
    title: 'Gaggal → Jwalamukhi',
    distance: '55 km',
    duration: '1.5 hrs',
    baseFare: '₹1,200',
    pickupVal: 'gaggal',
    dropVal: 'kangra_temple',
    svgPath: 'M 40 180 C 100 180, 140 100, 200 140 C 260 180, 300 80, 360 120',
    dropPoints: ['Jwalamukhi Temple Gate 1', 'Jwalamukhi Bus Stand', 'State Yatri Niwas'],
    photos: ['/assets/masroor_temple.png', '/assets/kangra_fort.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Kangra Bypass Charger', desc: 'EV charging backup station', x: 120, y: 145, type: 'stop', photoIndex: 0 },
      { name: 'Ranital Crossing rest', desc: 'Traditional local tea and sweets checkpoint', x: 230, y: 160, type: 'stop', photoIndex: 1 },
      { name: 'Jwalamukhi Temple', desc: 'Drop Point - Sacred flame temple of natural blue fire', x: 360, y: 120, type: 'end', photoIndex: 0 }
    ]
  },
  'route-5': {
    title: 'Gaggal → Manali',
    distance: '230 km',
    duration: '6–7 hrs',
    baseFare: '₹5,500',
    pickupVal: 'gaggal',
    dropVal: 'dharamshala',
    svgPath: 'M 40 180 C 90 140, 110 200, 180 160 C 240 120, 260 180, 360 40',
    dropPoints: ['Manali Mall Road Bus Stand', 'Old Manali Bridge', 'Hadimba Temple Road'],
    photos: ['/assets/bir_billing.png', '/assets/palampur_tea.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Palampur Tea Estate Bypass', desc: 'Lush green tea garden pathways', x: 105, y: 175, type: 'scenic', photoIndex: 1 },
      { name: 'Mandi Town EV Charger Hub', desc: 'EV quick charger station for lunch & vehicle backup charge', x: 190, y: 155, type: 'stop', photoIndex: 0 },
      { name: 'Kullu River Valley', desc: 'Breathtaking drive alongside the roaring Beas river', x: 270, y: 130, type: 'scenic', photoIndex: 0 },
      { name: 'Manali Mall Road', desc: 'Drop Point - Iconic snowy hilltop mall road terminal', x: 360, y: 40, type: 'end', photoIndex: 0 }
    ]
  },
  'route-6': {
    title: 'Gaggal → Baijnath Paprola',
    distance: '60 km',
    duration: '1.5 hrs',
    baseFare: '₹1,400',
    pickupVal: 'gaggal',
    dropVal: 'kangra_temple',
    svgPath: 'M 40 180 C 100 180, 150 140, 220 140 C 260 140, 310 120, 360 80',
    dropPoints: ['Baijnath Shiva Temple Complex', 'Baijnath Paprola Railway Station', 'Palampur Crossing Market'],
    photos: ['/assets/baijnath_temple.png', '/assets/palampur_tea.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Palampur Tea Garden Vistas', desc: 'Lush panoramic green estate terraces', x: 180, y: 150, type: 'scenic', photoIndex: 1 },
      { name: 'Baijnath Temple Gates', desc: 'Drop Point - Beautiful 13th-century stone Shiva temple monument', x: 360, y: 80, type: 'end', photoIndex: 0 }
    ]
  },
  'route-7': {
    title: 'Gaggal → Kangra Fort',
    distance: '22 km',
    duration: '45 min',
    baseFare: '₹700',
    pickupVal: 'gaggal',
    dropVal: 'kangra_temple',
    svgPath: 'M 40 180 C 120 180, 160 220, 220 140 C 260 80, 300 100, 360 80',
    dropPoints: ['Kangra Fort Entrance Ticket Booth', 'Kangra Devi Temple Crossing', 'Fort View Cafe Hub'],
    photos: ['/assets/kangra_fort.png', '/assets/masroor_temple.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Kangra Town Entry Point', desc: 'Historic local market checkpoint', x: 190, y: 170, type: 'stop', photoIndex: 1 },
      { name: 'Kangra Fort Museum Gates', desc: 'Drop Point - Ancient heritage fort with snow peak overlooks', x: 360, y: 80, type: 'end', photoIndex: 0 }
    ]
  },
  'route-8': {
    title: 'Gaggal → Chintpurni',
    distance: '80 km',
    duration: '2 hrs',
    baseFare: '₹2,000',
    pickupVal: 'gaggal',
    dropVal: 'kangra_temple',
    svgPath: 'M 40 180 C 100 180, 140 140, 200 160 C 260 180, 310 120, 360 140',
    dropPoints: ['Chintpurni Temple Parking Plaza', 'Mata Rani Main Market Gate', 'Bus Stand Hilltop'],
    photos: ['/assets/masroor_temple.png', '/assets/baijnath_temple.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Kandwal Toll Gate', desc: 'Himachal state entry border checkpoint', x: 130, y: 160, type: 'stop', photoIndex: 0 },
      { name: 'Mubarakpur Hill Rest Stop', desc: 'Hill station junction stop for tea and rest', x: 245, y: 155, type: 'stop', photoIndex: 1 },
      { name: 'Chintpurni Devi Temple', desc: 'Drop Point - Hilltop temple of wish fulfillment', x: 360, y: 140, type: 'end', photoIndex: 0 }
    ]
  },
  'route-9': {
    title: 'Gaggal → Palampur',
    distance: '35 km',
    duration: '55 min',
    baseFare: '₹900',
    pickupVal: 'gaggal',
    dropVal: 'dharamshala',
    svgPath: 'M 40 180 C 110 180, 140 120, 200 140 C 260 160, 310 100, 360 60',
    dropPoints: ['Palampur Tea Garden Plaza', 'Saurabh Van Vihar Entrance', 'Palampur Main Bazar Stand'],
    photos: ['/assets/palampur_tea.png', '/assets/bir_billing.png'],
    nodes: [
      { name: 'Gaggal Airport (DHM)', desc: 'Start Point', x: 40, y: 180, type: 'start', photoIndex: 0 },
      { name: 'Yol Cantt Pine Drive', desc: 'Beautiful pine forest drive with spectacular snow views', x: 190, y: 150, type: 'scenic', photoIndex: 1 },
      { name: 'Palampur Tea Garden Estates', desc: 'Drop Point - Iconic Northwest India tea garden fields', x: 360, y: 60, type: 'end', photoIndex: 0 }
    ]
  }
};
