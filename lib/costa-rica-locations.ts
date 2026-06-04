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

function canton(id: string, label: string, lat: number, lng: number): CantonOption {
  return {
    id,
    label,
    lat,
    lng,
    districts: [{ id: `${id}-centro`, label, lat, lng }],
  }
}

export const costaRicaLocations: ProvinceOption[] = [
  {
    id: 'san-jose',
    label: 'San Jose',
    lat: 9.9281,
    lng: -84.0907,
    cantons: [
      canton('san-jose', 'San Jose', 9.9281, -84.0907),
      canton('escazu', 'Escazu', 9.9189, -84.1399),
      canton('desamparados', 'Desamparados', 9.8981, -84.0647),
      canton('puriscal', 'Puriscal', 9.8469, -84.3146),
      canton('tarrazu', 'Tarrazú', 9.6595, -84.0205),
      canton('aserri', 'Aserrí', 9.8588, -84.0923),
      canton('mora', 'Mora', 9.9167, -84.2417),
      canton('goicoechea', 'Goicoechea', 9.9500, -84.0500),
      canton('santa-ana', 'Santa Ana', 9.9328, -84.1823),
      canton('alajuelita', 'Alajuelita', 9.9016, -84.1000),
      canton('vazquez-de-coronado', 'Vázquez de Coronado', 9.9766, -84.0065),
      canton('acosta', 'Acosta', 9.8000, -84.1667),
      canton('tibas', 'Tibás', 9.9581, -84.0784),
      canton('moravia', 'Moravia', 9.9616, -84.0488),
      canton('montes-de-oca', 'Montes de Oca', 9.9362, -84.0455),
      canton('turrubares', 'Turrubares', 9.9087, -84.4846),
      canton('dota', 'Dota', 9.6556, -83.9694),
      canton('curridabat', 'Curridabat', 9.9118, -84.0347),
      canton('perez-zeledon', 'Pérez Zeledón', 9.3720, -83.7030),
      canton('leon-cortes-castro', 'León Cortés Castro', 9.6880, -84.0530),
    ],
  },
  {
    id: 'alajuela',
    label: 'Alajuela',
    lat: 10.0162,
    lng: -84.2117,
    cantons: [
      canton('alajuela', 'Alajuela', 10.0162, -84.2117),
      canton('san-ramon', 'San Ramón', 10.0887, -84.4702),
      canton('grecia', 'Grecia', 10.0739, -84.3132),
      canton('san-mateo', 'San Mateo', 9.9420, -84.5264),
      canton('atenas', 'Atenas', 9.9789, -84.3786),
      canton('naranjo', 'Naranjo', 10.0987, -84.3868),
      canton('palmares', 'Palmares', 10.0573, -84.4316),
      canton('poas', 'Poás', 10.0800, -84.2440),
      canton('orotina', 'Orotina', 9.9110, -84.5237),
      canton('san-carlos', 'San Carlos', 10.3250, -84.4270),
      canton('zarcero', 'Zarcero', 10.1856, -84.3900),
      canton('sarchi', 'Sarchí', 10.0884, -84.3460),
      canton('upala', 'Upala', 10.8979, -85.0145),
      canton('los-chiles', 'Los Chiles', 11.0333, -84.7167),
      canton('guatuso', 'Guatuso', 10.6667, -84.8333),
      canton('rio-cuarto', 'Río Cuarto', 10.3422, -84.2142),
    ],
  },
  {
    id: 'cartago',
    label: 'Cartago',
    lat: 9.8644,
    lng: -83.9194,
    cantons: [
      canton('cartago', 'Cartago', 9.8644, -83.9194),
      canton('paraiso', 'Paraíso', 9.8383, -83.8656),
      canton('la-union', 'La Unión', 9.9063, -83.9856),
      canton('jimenez', 'Jiménez', 9.8461, -83.7523),
      canton('turrialba', 'Turrialba', 9.9050, -83.6835),
      canton('alvarado', 'Alvarado', 9.9333, -83.8000),
      canton('oreamuno', 'Oreamuno', 9.9000, -83.9167),
      canton('el-guarco', 'El Guarco', 9.8389, -83.9450),
    ],
  },
  {
    id: 'heredia',
    label: 'Heredia',
    lat: 9.9981,
    lng: -84.1198,
    cantons: [
      canton('heredia', 'Heredia', 9.9981, -84.1198),
      canton('barva', 'Barva', 10.0203, -84.1233),
      canton('santo-domingo', 'Santo Domingo', 9.9806, -84.0917),
      canton('santa-barbara', 'Santa Bárbara', 10.0380, -84.1580),
      canton('san-rafael', 'San Rafael', 10.0138, -84.1000),
      canton('san-isidro', 'San Isidro', 10.0190, -84.0560),
      canton('belen', 'Belén', 9.9780, -84.1850),
      canton('flores', 'Flores', 10.0000, -84.1580),
      canton('san-pablo', 'San Pablo', 9.9955, -84.0966),
      canton('sarapiqui', 'Sarapiquí', 10.4520, -84.0167),
    ],
  },
  {
    id: 'guanacaste',
    label: 'Guanacaste',
    lat: 10.6346,
    lng: -85.4407,
    cantons: [
      canton('liberia', 'Liberia', 10.6346, -85.4407),
      canton('nicoya', 'Nicoya', 10.1483, -85.4520),
      canton('santa-cruz', 'Santa Cruz', 10.2605, -85.5858),
      canton('bagaces', 'Bagaces', 10.5270, -85.2545),
      canton('carrillo', 'Carrillo', 10.4492, -85.7018),
      canton('canas', 'Cañas', 10.4297, -85.0931),
      canton('abangares', 'Abangares', 10.2827, -84.9592),
      canton('tilaran', 'Tilarán', 10.4677, -84.9675),
      canton('nandayure', 'Nandayure', 9.9994, -85.2241),
      canton('la-cruz', 'La Cruz', 11.0707, -85.6328),
      canton('hojancha', 'Hojancha', 10.0576, -85.4199),
    ],
  },
  {
    id: 'puntarenas',
    label: 'Puntarenas',
    lat: 9.9778,
    lng: -84.8294,
    cantons: [
      canton('puntarenas', 'Puntarenas', 9.9778, -84.8294),
      canton('esparza', 'Esparza', 9.9956, -84.6647),
      canton('buenos-aires', 'Buenos Aires', 9.1719, -83.3330),
      canton('montes-de-oro', 'Montes de Oro', 10.0833, -84.7333),
      canton('osa', 'Osa', 8.9599, -83.5263),
      canton('quepos', 'Quepos', 9.4319, -84.1611),
      canton('golfito', 'Golfito', 8.6390, -83.1666),
      canton('coto-brus', 'Coto Brus', 8.8833, -82.9667),
      canton('parrita', 'Parrita', 9.5200, -84.3225),
      canton('corredores', 'Corredores', 8.6414, -82.9460),
      canton('garabito', 'Garabito', 9.6145, -84.6298),
      canton('monteverde', 'Monteverde', 10.3150, -84.8250),
    ],
  },
  {
    id: 'limon',
    label: 'Limón',
    lat: 9.9907,
    lng: -83.0359,
    cantons: [
      canton('limon', 'Limón', 9.9907, -83.0359),
      canton('pococi', 'Pococí', 10.2149, -83.7846),
      canton('siquirres', 'Siquirres', 10.0975, -83.5066),
      canton('talamanca', 'Talamanca', 9.6243, -82.8494),
      canton('matina', 'Matina', 10.0760, -83.2890),
      canton('guacimo', 'Guácimo', 10.2129, -83.6879),
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
