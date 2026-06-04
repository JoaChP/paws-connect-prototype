export interface LocationOption {
  id: string
  label: string
  lat: number
  lng: number
}

export interface CantonOption extends LocationOption {
  districts: LocationOption[]
}

export interface ProvinceOption extends LocationOption {
  cantons: CantonOption[]
}

export const costaRicaLocations: ProvinceOption[] = [
  {
    id: 'san-jose',
    label: 'San Jose',
    lat: 9.9281,
    lng: -84.0907,
    cantons: [
      {
        id: 'san-jose-central',
        label: 'San Jose',
        lat: 9.9281,
        lng: -84.0907,
        districts: [
          { id: 'carmen', label: 'Carmen', lat: 9.9365, lng: -84.0766 },
          { id: 'merced', label: 'Merced', lat: 9.9398, lng: -84.0849 },
          { id: 'hospital', label: 'Hospital', lat: 9.9263, lng: -84.0893 },
          { id: 'catedral', label: 'Catedral', lat: 9.9281, lng: -84.0785 },
          { id: 'pavas', label: 'Pavas', lat: 9.9515, lng: -84.1343 },
        ],
      },
      {
        id: 'escazu',
        label: 'Escazu',
        lat: 9.9189,
        lng: -84.1399,
        districts: [
          { id: 'escazu-centro', label: 'Escazu', lat: 9.9189, lng: -84.1399 },
          { id: 'san-antonio-escazu', label: 'San Antonio', lat: 9.9037, lng: -84.1441 },
          { id: 'san-rafael-escazu', label: 'San Rafael', lat: 9.9451, lng: -84.1393 },
        ],
      },
      {
        id: 'santa-ana',
        label: 'Santa Ana',
        lat: 9.9328,
        lng: -84.1823,
        districts: [
          { id: 'santa-ana-centro', label: 'Santa Ana', lat: 9.9328, lng: -84.1823 },
          { id: 'pozos', label: 'Pozos', lat: 9.9494, lng: -84.1917 },
          { id: 'piedades', label: 'Piedades', lat: 9.9259, lng: -84.2165 },
        ],
      },
    ],
  },
  {
    id: 'alajuela',
    label: 'Alajuela',
    lat: 10.0162,
    lng: -84.2117,
    cantons: [
      {
        id: 'alajuela-central',
        label: 'Alajuela',
        lat: 10.0162,
        lng: -84.2117,
        districts: [
          { id: 'alajuela-centro', label: 'Alajuela', lat: 10.0162, lng: -84.2117 },
          { id: 'san-jose-alajuela', label: 'San Jose', lat: 10.0011, lng: -84.2271 },
          { id: 'san-antonio-alajuela', label: 'San Antonio', lat: 9.9835, lng: -84.2543 },
          { id: 'guacima', label: 'Guacima', lat: 9.9631, lng: -84.2569 },
        ],
      },
      {
        id: 'san-ramon',
        label: 'San Ramon',
        lat: 10.0887,
        lng: -84.4702,
        districts: [
          { id: 'san-ramon-centro', label: 'San Ramon', lat: 10.0887, lng: -84.4702 },
          { id: 'santiago-san-ramon', label: 'Santiago', lat: 10.0453, lng: -84.5008 },
          { id: 'piedades-norte', label: 'Piedades Norte', lat: 10.1107, lng: -84.5383 },
        ],
      },
      {
        id: 'grecia',
        label: 'Grecia',
        lat: 10.0739,
        lng: -84.3132,
        districts: [
          { id: 'grecia-centro', label: 'Grecia', lat: 10.0739, lng: -84.3132 },
          { id: 'san-isidro-grecia', label: 'San Isidro', lat: 10.1049, lng: -84.2985 },
          { id: 'tacares', label: 'Tacares', lat: 10.0384, lng: -84.3227 },
        ],
      },
    ],
  },
  {
    id: 'cartago',
    label: 'Cartago',
    lat: 9.8644,
    lng: -83.9194,
    cantons: [
      {
        id: 'cartago-central',
        label: 'Cartago',
        lat: 9.8644,
        lng: -83.9194,
        districts: [
          { id: 'oriental', label: 'Oriental', lat: 9.8644, lng: -83.9194 },
          { id: 'occidental', label: 'Occidental', lat: 9.8604, lng: -83.9273 },
          { id: 'carmen-cartago', label: 'Carmen', lat: 9.8804, lng: -83.9142 },
        ],
      },
      {
        id: 'la-union',
        label: 'La Union',
        lat: 9.9063,
        lng: -83.9856,
        districts: [
          { id: 'tres-rios', label: 'Tres Rios', lat: 9.9063, lng: -83.9856 },
          { id: 'san-diego', label: 'San Diego', lat: 9.8984, lng: -84.0021 },
          { id: 'concepcion-la-union', label: 'Concepcion', lat: 9.9302, lng: -83.9983 },
        ],
      },
    ],
  },
  {
    id: 'heredia',
    label: 'Heredia',
    lat: 9.9981,
    lng: -84.1198,
    cantons: [
      {
        id: 'heredia-central',
        label: 'Heredia',
        lat: 9.9981,
        lng: -84.1198,
        districts: [
          { id: 'heredia-centro', label: 'Heredia', lat: 9.9981, lng: -84.1198 },
          { id: 'mercedes-heredia', label: 'Mercedes', lat: 10.0065, lng: -84.1336 },
          { id: 'san-francisco-heredia', label: 'San Francisco', lat: 9.9928, lng: -84.1297 },
        ],
      },
      {
        id: 'santo-domingo',
        label: 'Santo Domingo',
        lat: 9.9806,
        lng: -84.0917,
        districts: [
          { id: 'santo-domingo-centro', label: 'Santo Domingo', lat: 9.9806, lng: -84.0917 },
          { id: 'santa-rosa-santo-domingo', label: 'Santa Rosa', lat: 9.9894, lng: -84.0836 },
          { id: 'santo-tomas', label: 'Santo Tomas', lat: 9.9814, lng: -84.0744 },
        ],
      },
    ],
  },
  {
    id: 'guanacaste',
    label: 'Guanacaste',
    lat: 10.6346,
    lng: -85.4407,
    cantons: [
      {
        id: 'liberia',
        label: 'Liberia',
        lat: 10.6346,
        lng: -85.4407,
        districts: [
          { id: 'liberia-centro', label: 'Liberia', lat: 10.6346, lng: -85.4407 },
          { id: 'canas-dulces', label: 'Canas Dulces', lat: 10.7344, lng: -85.4844 },
          { id: 'mayorga', label: 'Mayorga', lat: 10.7782, lng: -85.3502 },
          { id: 'nacascolo', label: 'Nacascolo', lat: 10.6228, lng: -85.6527 },
          { id: 'curubande', label: 'Curubande', lat: 10.7071, lng: -85.3601 },
        ],
      },
      {
        id: 'nicoya',
        label: 'Nicoya',
        lat: 10.1483,
        lng: -85.4520,
        districts: [
          { id: 'nicoya-centro', label: 'Nicoya', lat: 10.1483, lng: -85.4520 },
          { id: 'mansion', label: 'Mansion', lat: 10.0879, lng: -85.3566 },
          { id: 'san-antonio-nicoya', label: 'San Antonio', lat: 10.1929, lng: -85.4116 },
          { id: 'samara', label: 'Samara', lat: 9.8812, lng: -85.5283 },
          { id: 'nosara', label: 'Nosara', lat: 9.9797, lng: -85.6534 },
        ],
      },
      {
        id: 'santa-cruz',
        label: 'Santa Cruz',
        lat: 10.2605,
        lng: -85.5858,
        districts: [
          { id: 'santa-cruz-centro', label: 'Santa Cruz', lat: 10.2605, lng: -85.5858 },
          { id: 'bolson', label: 'Bolson', lat: 10.3697, lng: -85.4168 },
          { id: 'veintisiete-abril', label: 'Veintisiete de Abril', lat: 10.1604, lng: -85.6714 },
          { id: 'tempate', label: 'Tempate', lat: 10.3497, lng: -85.7625 },
          { id: 'tamarindo', label: 'Tamarindo', lat: 10.2993, lng: -85.8371 },
        ],
      },
      {
        id: 'bagaces',
        label: 'Bagaces',
        lat: 10.5270,
        lng: -85.2545,
        districts: [
          { id: 'bagaces-centro', label: 'Bagaces', lat: 10.5270, lng: -85.2545 },
          { id: 'fortuna-bagaces', label: 'Fortuna', lat: 10.6812, lng: -85.1997 },
          { id: 'mogote', label: 'Mogote', lat: 10.7056, lng: -85.2667 },
          { id: 'rio-naranjo', label: 'Rio Naranjo', lat: 10.7241, lng: -85.1123 },
        ],
      },
      {
        id: 'carrillo',
        label: 'Carrillo',
        lat: 10.4492,
        lng: -85.7018,
        districts: [
          { id: 'filadelfia', label: 'Filadelfia', lat: 10.4492, lng: -85.7018 },
          { id: 'palmira-carrillo', label: 'Palmira', lat: 10.5262, lng: -85.6595 },
          { id: 'sardinal', label: 'Sardinal', lat: 10.5168, lng: -85.6479 },
          { id: 'belen-carrillo', label: 'Belen', lat: 10.4079, lng: -85.5886 },
        ],
      },
      {
        id: 'canas',
        label: 'Canas',
        lat: 10.4297,
        lng: -85.0931,
        districts: [
          { id: 'canas-centro', label: 'Canas', lat: 10.4297, lng: -85.0931 },
          { id: 'palmira-canas', label: 'Palmira', lat: 10.3895, lng: -85.0498 },
          { id: 'san-miguel-canas', label: 'San Miguel', lat: 10.3252, lng: -85.0773 },
          { id: 'bebedero', label: 'Bebedero', lat: 10.3350, lng: -85.2140 },
          { id: 'porozal', label: 'Porozal', lat: 10.3536, lng: -85.1671 },
        ],
      },
      {
        id: 'abangares',
        label: 'Abangares',
        lat: 10.2827,
        lng: -84.9592,
        districts: [
          { id: 'juntas', label: 'Las Juntas', lat: 10.2827, lng: -84.9592 },
          { id: 'sierra-abangares', label: 'Sierra', lat: 10.2736, lng: -84.9146 },
          { id: 'san-juan-abangares', label: 'San Juan', lat: 10.2215, lng: -84.9761 },
          { id: 'colorado-abangares', label: 'Colorado', lat: 10.2554, lng: -85.0804 },
        ],
      },
      {
        id: 'tilaran',
        label: 'Tilaran',
        lat: 10.4677,
        lng: -84.9675,
        districts: [
          { id: 'tilaran-centro', label: 'Tilaran', lat: 10.4677, lng: -84.9675 },
          { id: 'quebrada-grande', label: 'Quebrada Grande', lat: 10.4794, lng: -85.0151 },
          { id: 'tronadora', label: 'Tronadora', lat: 10.5056, lng: -84.9185 },
          { id: 'arenal', label: 'Arenal', lat: 10.5489, lng: -84.8969 },
        ],
      },
      {
        id: 'nandaiure',
        label: 'Nandayure',
        lat: 9.9994,
        lng: -85.2241,
        districts: [
          { id: 'carmona', label: 'Carmona', lat: 9.9994, lng: -85.2241 },
          { id: 'santa-rita-nandayure', label: 'Santa Rita', lat: 10.0517, lng: -85.2247 },
          { id: 'zapotal', label: 'Zapotal', lat: 10.0986, lng: -85.1993 },
          { id: 'bejuco', label: 'Bejuco', lat: 9.8585, lng: -85.3002 },
        ],
      },
      {
        id: 'la-cruz',
        label: 'La Cruz',
        lat: 11.0707,
        lng: -85.6328,
        districts: [
          { id: 'la-cruz-centro', label: 'La Cruz', lat: 11.0707, lng: -85.6328 },
          { id: 'santa-cecilia', label: 'Santa Cecilia', lat: 11.1046, lng: -85.4159 },
          { id: 'garita-la-cruz', label: 'La Garita', lat: 11.0388, lng: -85.4994 },
          { id: 'santa-elena-la-cruz', label: 'Santa Elena', lat: 10.8706, lng: -85.7813 },
        ],
      },
      {
        id: 'hojancha',
        label: 'Hojancha',
        lat: 10.0576,
        lng: -85.4199,
        districts: [
          { id: 'hojancha-centro', label: 'Hojancha', lat: 10.0576, lng: -85.4199 },
          { id: 'monte-romo', label: 'Monte Romo', lat: 10.0202, lng: -85.3712 },
          { id: 'puerto-carrillo', label: 'Puerto Carrillo', lat: 9.8661, lng: -85.4837 },
          { id: 'huacas-hojancha', label: 'Huacas', lat: 10.0125, lng: -85.4642 },
        ],
      },
    ],
  },
  {
    id: 'puntarenas',
    label: 'Puntarenas',
    lat: 9.9778,
    lng: -84.8294,
    cantons: [
      {
        id: 'puntarenas-central',
        label: 'Puntarenas',
        lat: 9.9778,
        lng: -84.8294,
        districts: [
          { id: 'puntarenas-centro', label: 'Puntarenas', lat: 9.9778, lng: -84.8294 },
          { id: 'barranca', label: 'Barranca', lat: 9.9774, lng: -84.7168 },
          { id: 'el-roble', label: 'El Roble', lat: 9.9819, lng: -84.7503 },
        ],
      },
      {
        id: 'garabito',
        label: 'Garabito',
        lat: 9.6145,
        lng: -84.6298,
        districts: [
          { id: 'jaco', label: 'Jaco', lat: 9.6145, lng: -84.6298 },
          { id: 'tarcoles', label: 'Tarcoles', lat: 9.7644, lng: -84.6261 },
        ],
      },
    ],
  },
  {
    id: 'limon',
    label: 'Limon',
    lat: 9.9907,
    lng: -83.0359,
    cantons: [
      {
        id: 'limon-central',
        label: 'Limon',
        lat: 9.9907,
        lng: -83.0359,
        districts: [
          { id: 'limon-centro', label: 'Limon', lat: 9.9907, lng: -83.0359 },
          { id: 'valle-la-estrella', label: 'Valle La Estrella', lat: 9.7389, lng: -83.0964 },
          { id: 'rio-blanco-limon', label: 'Rio Blanco', lat: 10.0152, lng: -83.1259 },
        ],
      },
      {
        id: 'pococi',
        label: 'Pococi',
        lat: 10.2149,
        lng: -83.7846,
        districts: [
          { id: 'guapiles', label: 'Guapiles', lat: 10.2149, lng: -83.7846 },
          { id: 'jimenez-pococi', label: 'Jimenez', lat: 10.2091, lng: -83.7355 },
          { id: 'rita', label: 'Rita', lat: 10.2511, lng: -83.7845 },
        ],
      },
    ],
  },
]

export function findProvince(provinceId: string) {
  return costaRicaLocations.find((province) => province.id === provinceId)
}

export function findCanton(provinceId: string, cantonId: string) {
  return findProvince(provinceId)?.cantons.find((canton) => canton.id === cantonId)
}

export function findDistrict(provinceId: string, cantonId: string, districtId: string) {
  return findCanton(provinceId, cantonId)?.districts.find((district) => district.id === districtId)
}
