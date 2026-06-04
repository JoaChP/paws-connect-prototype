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

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function canton(id: string, label: string, lat: number, lng: number, districts: string[]): CantonOption {
  return {
    id,
    label,
    lat,
    lng,
    districts: districts.map((district) => ({
      id: `${id}-${slugify(district)}`,
      label: district,
      lat,
      lng,
    })),
  }
}

export const costaRicaLocations: ProvinceOption[] = [
  {
    id: 'san-jose',
    label: 'San José',
    lat: 9.9281,
    lng: -84.0907,
    cantons: [
      canton('san-jose', 'San José', 9.9281, -84.0907, ['Carmen', 'Merced', 'Hospital', 'Catedral', 'Zapote', 'San Francisco de Dos Ríos', 'Uruca', 'Mata Redonda', 'Pavas', 'Hatillo', 'San Sebastián']),
      canton('escazu', 'Escazú', 9.9189, -84.1399, ['Escazú', 'San Antonio', 'San Rafael']),
      canton('desamparados', 'Desamparados', 9.8981, -84.0647, ['Desamparados', 'San Miguel', 'San Juan de Dios', 'San Rafael Arriba', 'San Antonio', 'Frailes', 'Patarra', 'San Cristobal', 'Rosario', 'Damas', 'San Rafael Abajo', 'Gravilias', 'Los Guido']),
      canton('puriscal', 'Puriscal', 9.8469, -84.3146, ['Santiago', 'Mercedes Sur', 'Barbacoas', 'Grifo Alto', 'San Rafael', 'Candelarita', 'Desamparaditos', 'San Antonio', 'Chires']),
      canton('tarrazu', 'Tarrazú', 9.6595, -84.0205, ['San Marcos', 'San Lorenzo', 'San Carlos']),
      canton('aserri', 'Aserrí', 9.8588, -84.0923, ['Aserrí', 'Tarbaca', 'Vuelta de Jorco', 'San Gabriel', 'Legua', 'Monterrey', 'Salitrillos']),
      canton('mora', 'Mora', 9.9167, -84.2417, ['Colón', 'Guayabo', 'Tabarcia', 'Piedras Negras', 'Picagres', 'Jaris', 'Quitirrisí']),
      canton('goicoechea', 'Goicoechea', 9.9500, -84.0500, ['Guadalupe', 'San Francisco', 'Calle Blancos', 'Mata de Plátano', 'Ipis', 'Rancho Redondo', 'Purral']),
      canton('santa-ana', 'Santa Ana', 9.9328, -84.1823, ['Santa Ana', 'Salitral', 'Pozos', 'Uruca', 'Piedades', 'Brasil']),
      canton('alajuelita', 'Alajuelita', 9.9016, -84.1000, ['Alajuelita', 'San Josecito', 'San Antonio', 'Concepción', 'San Felipe']),
      canton('vazquez-de-coronado', 'Vazquez de Coronado', 9.9766, -84.0065, ['San Isidro', 'San Rafael', 'Dulce Nombre de Jesús', 'Patalillo', 'Cascajal']),
      canton('acosta', 'Acosta', 9.8000, -84.1667, ['San Ignacio', 'Guaitil', 'Palmichal', 'Cangrejal', 'Sabanillas']),
      canton('tibas', 'Tibás', 9.9581, -84.0784, ['San Juan', 'Cinco Esquinas', 'Anselmo Llorente', 'León XIII', 'Colima']),
      canton('moravia', 'Moravia', 9.9616, -84.0488, ['San Vicente', 'San Jerónimo', 'La Trinidad']),
      canton('montes-de-oca', 'Montes de Oca', 9.9362, -84.0455, ['San Pedro', 'Sabanilla', 'Mercedes', 'San Rafael']),
      canton('turrubares', 'Turrubares', 9.9087, -84.4846, ['San Pablo', 'San Pedro', 'San Juan de Mata', 'San Luis', 'Carara']),
      canton('dota', 'Dota', 9.6556, -83.9694, ['Santa María', 'Jardín', 'Copey']),
      canton('curridabat', 'Curridabat', 9.9118, -84.0347, ['Curridabat', 'Granadilla', 'Sánchez', 'Tirrases']),
      canton('perez-zeledon', 'Pérez Zeledón', 9.3720, -83.7030, ['San Isidro de El General', 'El General', 'Daniel Flores', 'Rivas', 'San Pedro', 'Platanares', 'Pejibaye', 'Cajón', 'Barú', 'Río Nuevo', 'Paramo', 'La Amistad']),
      canton('leon-cortes-castro', 'León Cortés Castro', 9.6880, -84.0530, ['San Pablo', 'San Andrés', 'Llano Bonito', 'San Isidro', 'Santa Cruz', 'San Antonio']),
    ],
  },
  {
    id: 'alajuela',
    label: 'Alajuela',
    lat: 10.0162,
    lng: -84.2117,
    cantons: [
      canton('alajuela', 'Alajuela', 10.0162, -84.2117, ['Alajuela', 'San José', 'Carrizal', 'San Antonio', 'Guácima', 'San Isidro', 'Sabanilla', 'San Rafael', 'Río Segundo', 'Desamparados', 'Turrucares', 'Tambor', 'Garita', 'Sarapiquí']),
      canton('san-ramon', 'San Ramón', 10.0887, -84.4702, ['San Ramón', 'Santiago', 'San Juan', 'Piedades Norte', 'Piedades Sur', 'San Rafael', 'San Isidro', 'Ángeles', 'Alfaro', 'Volio', 'Concepción', 'Zapotal', 'Peñas Blancas', 'San Lorenzo']),
      canton('grecia', 'Grecia', 10.0739, -84.3132, ['Grecia', 'San Isidro', 'San José', 'San Roque', 'Tacares', 'Puente de Piedra', 'Bolivar']),
      canton('san-mateo', 'San Mateo', 9.9420, -84.5264, ['San Mateo', 'Desmonte', 'Jesús María', 'Labrador']),
      canton('atenas', 'Atenas', 9.9789, -84.3786, ['Atenas', 'Jesús', 'Mercedes', 'San Isidro', 'Concepción', 'San José', 'Santa Eulalia', 'Escobal']),
      canton('naranjo', 'Naranjo', 10.0987, -84.3868, ['Naranjo', 'San Miguel', 'San José', 'Cirrí Sur', 'San Jerónimo', 'San Juan', 'El Rosario', 'Palmitos']),
      canton('palmares', 'Palmares', 10.0573, -84.4316, ['Palmares', 'Zaragoza', 'Buenos Aires', 'Santiago', 'Candelaria', 'Esquipulas', 'La Granja']),
      canton('poas', 'Poás', 10.0800, -84.2440, ['San Pedro', 'San Juan', 'San Rafael', 'Carrillos', 'Sabana Redonda']),
      canton('orotina', 'Orotina', 9.9110, -84.5237, ['Orotina', 'El Mastate', 'Hacienda Vieja', 'Coyolar', 'La Ceiba']),
      canton('san-carlos', 'San Carlos', 10.3250, -84.4270, ['Quesada', 'Florencia', 'Buenavista', 'Aguas Zarcas', 'Venecia', 'Pital', 'La Fortuna', 'La Tigra', 'La Palmera', 'Venado', 'Cutris', 'Monterrey', 'Pocosol']),
      canton('zarcero', 'Zarcero', 10.1856, -84.3900, ['Zarcero', 'Laguna', 'Tapezco', 'Guadalupe', 'Palmira', 'Zapote', 'Brisas']),
      canton('sarchi', 'Sarchí', 10.0884, -84.3460, ['Sarchí Norte', 'Sarchí Sur', 'Toro Amarillo', 'San Pedro', 'Rodríguez']),
      canton('upala', 'Upala', 10.8979, -85.0145, ['Upala', 'Aguas Claras', 'San José O Pizote', 'Bijagua', 'Delicias', 'Dos Ríos', 'Yolillal', 'Canalete']),
      canton('los-chiles', 'Los Chiles', 11.0333, -84.7167, ['Los Chiles', 'Caño Negro', 'El Amparo', 'San Jorge']),
      canton('guatuso', 'Guatuso', 10.6667, -84.8333, ['San Rafael', 'Buenavista', 'Cote', 'Katira']),
      canton('rio-cuarto', 'Río Cuarto', 10.3422, -84.2142, ['Río Cuarto', 'Santa Rita', 'Santa Isabel']),
    ],
  },
  {
    id: 'cartago',
    label: 'Cartago',
    lat: 9.8644,
    lng: -83.9194,
    cantons: [
      canton('cartago', 'Cartago', 9.8644, -83.9194, ['Oriental', 'Occidental', 'Carmen', 'San Nicolás', 'Aguacaliente o San Francisco', 'Guadalupe o Arenilla', 'Corralillo', 'Tierra Blanca', 'Dulce Nombre', 'Llano Grande', 'Quebradilla']),
      canton('paraiso', 'Paraíso', 9.8383, -83.8656, ['Paraíso', 'Santiago', 'Orosi', 'Cachí', 'Llanos de Santa Lucía', 'Birrisito']),
      canton('la-union', 'La Unión', 9.9063, -83.9856, ['Tres Ríos', 'San Diego', 'San Juan', 'San Rafael', 'Concepción', 'Dulce Nombre', 'San Ramón', 'Río Azul']),
      canton('jimenez', 'Jiménez', 9.8461, -83.7523, ['Juan Viñas', 'Tucurrique', 'Pejibaye']),
      canton('turrialba', 'Turrialba', 9.9050, -83.6835, ['Turrialba', 'La Suiza', 'Peralta', 'Santa Cruz', 'Santa Teresita', 'Pavones', 'Tuis', 'Tayutic', 'Santa Rosa', 'Tres Equis', 'La Isabel', 'Chirripó']),
      canton('alvarado', 'Alvarado', 9.9333, -83.8000, ['Pacayas', 'Cervantes', 'Capellades']),
      canton('oreamuno', 'Oreamuno', 9.9000, -83.9167, ['San Rafael', 'Cot', 'Potrero Cerrado', 'Cipreses', 'Santa Rosa']),
      canton('el-guarco', 'El Guarco', 9.8389, -83.9450, ['El Tejar', 'San Isidro', 'Tobosi', 'Patio de Agua']),
    ],
  },
  {
    id: 'heredia',
    label: 'Heredia',
    lat: 9.9981,
    lng: -84.1198,
    cantons: [
      canton('heredia', 'Heredia', 9.9981, -84.1198, ['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca']),
      canton('barva', 'Barva', 10.0203, -84.1233, ['Barva', 'San Pedro', 'San Pablo', 'San Roque', 'Santa Lucía', 'San José de la Montaña']),
      canton('santo-domingo', 'Santo Domingo', 9.9806, -84.0917, ['Santo Domingo', 'San Vicente', 'San Miguel', 'Paracito', 'Santo Tomás', 'Santa Rosa', 'Tures', 'Pará']),
      canton('santa-barbara', 'Santa Bárbara', 10.0380, -84.1580, ['Santa Bárbara', 'San Pedro', 'San Juan', 'Jesús', 'Santo Domingo', 'Purabá']),
      canton('san-rafael', 'San Rafael', 10.0138, -84.1000, ['San Rafael', 'San Josecito', 'Santiago', 'Ángeles', 'Concepción']),
      canton('san-isidro', 'San Isidro', 10.0190, -84.0560, ['San Isidro', 'San José', 'Concepción', 'San Francisco']),
      canton('belen', 'Belén', 9.9780, -84.1850, ['San Antonio', 'La Ribera', 'La Asunción']),
      canton('flores', 'Flores', 10.0000, -84.1580, ['San Joaquín', 'Barrantes', 'Llorente']),
      canton('san-pablo', 'San Pablo', 9.9955, -84.0966, ['San Pablo', 'Rincón de Sabanilla']),
      canton('sarapiqui', 'Sarapiquí', 10.4520, -84.0167, ['Puerto Viejo', 'La Virgen', 'Las Horquetas', 'Llanuras del Gaspar', 'Cureña']),
    ],
  },
  {
    id: 'guanacaste',
    label: 'Guanacaste',
    lat: 10.6346,
    lng: -85.4407,
    cantons: [
      canton('liberia', 'Liberia', 10.6346, -85.4407, ['Liberia', 'Cañas Dulces', 'Mayorga', 'Nacascolo', 'Curubandé']),
      canton('nicoya', 'Nicoya', 10.1483, -85.4520, ['Nicoya', 'Mansión', 'San Antonio', 'Quebrada Honda', 'Sámara', 'Nosara', 'Belén de Nosarita']),
      canton('santa-cruz', 'Santa Cruz', 10.2605, -85.5858, ['Santa Cruz', 'Bolsón', 'Veintisiete de Abril', 'Tempate', 'Cartagena', 'Cuajiniquil', 'Diriá', 'Cabo Velas', 'Tamarindo']),
      canton('bagaces', 'Bagaces', 10.5270, -85.2545, ['Bagaces', 'La Fortuna', 'Mogote', 'Río Naranjo']),
      canton('carrillo', 'Carrillo', 10.4492, -85.7018, ['Filadelfia', 'Palmira', 'Sardinal', 'Belén']),
      canton('canas', 'Cañas', 10.4297, -85.0931, ['Cañas', 'Palmira', 'San Miguel', 'Bebedero', 'Porozal']),
      canton('abangares', 'Abangares', 10.2827, -84.9592, ['Las Juntas', 'Sierra', 'San Juan', 'Colorado']),
      canton('tilaran', 'Tilarán', 10.4677, -84.9675, ['Tilarán', 'Quebrada Grande', 'Tronadora', 'Santa Rosa', 'Líbano', 'Tierras Morenas', 'Arenal', 'Cabeceras']),
      canton('nandayure', 'Nandayure', 9.9994, -85.2241, ['Carmona', 'Santa Rita', 'Zapotal', 'San Pablo', 'Porvenir', 'Bejuco']),
      canton('la-cruz', 'La Cruz', 11.0707, -85.6328, ['La Cruz', 'Santa Cecilia', 'La Garita', 'Santa Elena']),
      canton('hojancha', 'Hojancha', 10.0576, -85.4199, ['Hojancha', 'Monte Romo', 'Puerto Carrillo', 'Huacas', 'Matambú']),
    ],
  },
  {
    id: 'puntarenas',
    label: 'Puntarenas',
    lat: 9.9778,
    lng: -84.8294,
    cantons: [
      canton('puntarenas', 'Puntarenas', 9.9778, -84.8294, ['Puntarenas', 'Pitahaya', 'Chomes', 'Lepanto', 'Paquera', 'Manzanillo', 'Guacimal', 'Barranca', 'Isla del Coco', 'Cóbano', 'Chacarita', 'Chira', 'Acapulco', 'El Roble', 'Arancibia']),
      canton('esparza', 'Esparza', 9.9956, -84.6647, ['Espíritu Santo', 'San Juan Grande', 'Macacona', 'San Rafael', 'San Jerónimo', 'Caldera']),
      canton('buenos-aires', 'Buenos Aires', 9.1719, -83.3330, ['Buenos Aires', 'Volcán', 'Potrero Grande', 'Boruca', 'Pilas', 'Colinas', 'Chánguena', 'Biolley', 'Brunka']),
      canton('montes-de-oro', 'Montes de Oro', 10.0833, -84.7333, ['Miramar', 'La Unión', 'San Isidro']),
      canton('osa', 'Osa', 8.9599, -83.5263, ['Puerto Cortés', 'Palmar', 'Sierpe', 'Bahía Ballena', 'Piedras Blancas', 'Bahía Drake']),
      canton('quepos', 'Quepos', 9.4319, -84.1611, ['Quepos', 'Savegre', 'Naranjito']),
      canton('golfito', 'Golfito', 8.6390, -83.1666, ['Golfito', 'Puerto Jiménez', 'Guaycará', 'Pavón']),
      canton('coto-brus', 'Coto Brus', 8.8833, -82.9667, ['San Vito', 'Sabalito', 'Aguabuena', 'Limoncito', 'Pittier', 'Gutiérrez Braun']),
      canton('parrita', 'Parrita', 9.5200, -84.3225, ['Parrita']),
      canton('corredores', 'Corredores', 8.6414, -82.9460, ['Corredor', 'La Cuesta', 'Canoas', 'Laurel']),
      canton('garabito', 'Garabito', 9.6145, -84.6298, ['Jacó', 'Tárcoles', 'Lagunillas']),
      canton('monteverde', 'Monteverde', 10.3150, -84.8250, ['Monteverde']),
    ],
  },
  {
    id: 'limon',
    label: 'Limón',
    lat: 9.9907,
    lng: -83.0359,
    cantons: [
      canton('limon', 'Limón', 9.9907, -83.0359, ['Limón', 'Valle La Estrella', 'Río Blanco', 'Matama']),
      canton('pococi', 'Pococí', 10.2149, -83.7846, ['Guápiles', 'Jiménez', 'Rita', 'Roxana', 'Cariari', 'Colorado', 'La Colonia']),
      canton('siquirres', 'Siquirres', 10.0975, -83.5066, ['Siquirres', 'Pacuarito', 'Florida', 'Germania', 'El Cairo', 'Alegría', 'Reventazón']),
      canton('talamanca', 'Talamanca', 9.6243, -82.8494, ['Bratsi', 'Sixaola', 'Cahuita', 'Telire']),
      canton('matina', 'Matina', 10.0760, -83.2890, ['Matina', 'Batán', 'Carrandí']),
      canton('guacimo', 'Guácimo', 10.2129, -83.6879, ['Guácimo', 'Mercedes', 'Pocora']),
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
