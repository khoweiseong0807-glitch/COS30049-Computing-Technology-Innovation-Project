export type VehicleClassId =
  | 'motorcar'
  | 'motorcycle'
  | 'goods'
  | 'bus'
  | 'hire'
  | 'other'

export type FuelId = 'petrol' | 'diesel' | 'hybrid' | 'bev'
export type UsageId = 'private' | 'commercial' | 'public'

export const CLASSES: Record<
  VehicleClassId,
  { label: string; malay: string; color: string }
> = {
  motorcar: { label: 'Motorcar', malay: 'Motokar', color: '#d4a017' },
  motorcycle: { label: 'Motorcycle', malay: 'Motosikal', color: '#2563eb' },
  goods: { label: 'Goods vehicle', malay: 'Kenderaan barang', color: '#dc4a26' },
  bus: { label: 'Bus', malay: 'Bas', color: '#0d9488' },
  hire: { label: 'Hire & taxi', malay: 'Kereta sewa / teksi', color: '#7c3aed' },
  other: { label: 'Other', malay: 'Lain-lain', color: '#64748b' },
}

export const YEARLY_TOTALS = [
  { year: 2023, total: 1_533_285 },
  { year: 2024, total: 1_570_121 },
  { year: 2025, total: 1_629_389 },
]

/** New JPJ registrations by type. 2025 = MOT parliamentary figures. */
export const REGISTRATIONS_BY_TYPE: Record<number, Record<VehicleClassId, number>> = {
  2023: {
    motorcar: 790_100,
    motorcycle: 678_400,
    goods: 38_200,
    bus: 1_180,
    hire: 5_405,
    other: 20_000,
  },
  2024: {
    motorcar: 824_300,
    motorcycle: 686_900,
    goods: 36_800,
    bus: 1_190,
    hire: 5_931,
    other: 15_000,
  },
  2025: {
    motorcar: 861_515,
    motorcycle: 704_251,
    goods: 35_414,
    bus: 1_221,
    hire: 5_998,
    other: 20_990,
  },
}

export const EV_PASSENGER = [
  { year: 2022, bev: 4_300 },
  { year: 2023, bev: 15_700 },
  { year: 2024, bev: 14_766 },
  { year: 2025, bev: 30_848 },
]

export const STATES = [
  { name: 'Selangor', motorcar: 198_400, motorcycle: 142_200 },
  { name: 'W.P. Kuala Lumpur', motorcar: 96_800, motorcycle: 48_100 },
  { name: 'Johor', motorcar: 112_600, motorcycle: 98_400 },
  { name: 'Pulau Pinang', motorcar: 64_200, motorcycle: 71_800 },
  { name: 'Perak', motorcar: 58_100, motorcycle: 67_300 },
  { name: 'Sarawak', motorcar: 51_400, motorcycle: 44_900 },
  { name: 'Sabah', motorcar: 47_200, motorcycle: 52_600 },
  { name: 'Kedah', motorcar: 41_800, motorcycle: 58_700 },
  { name: 'Negeri Sembilan', motorcar: 32_400, motorcycle: 29_100 },
  { name: 'Pahang', motorcar: 31_900, motorcycle: 33_400 },
  { name: 'Melaka', motorcar: 28_700, motorcycle: 24_800 },
  { name: 'Kelantan', motorcar: 24_100, motorcycle: 41_200 },
  { name: 'Terengganu', motorcar: 21_600, motorcycle: 32_900 },
  { name: 'Perlis', motorcar: 6_400, motorcycle: 8_100 },
  { name: 'W.P. Labuan', motorcar: 3_200, motorcycle: 2_400 },
  { name: 'W.P. Putrajaya', motorcar: 8_900, motorcycle: 1_800 },
]

export const ENERGY_RATES: Record<
  VehicleClassId,
  { petrolL: number; dieselL: number; hybridL: number; bevKwh: number; defaultKm: number }
> = {
  motorcycle: { petrolL: 2.4, dieselL: 2.2, hybridL: 1.8, bevKwh: 4.5, defaultKm: 8_000 },
  motorcar: { petrolL: 7.2, dieselL: 6.1, hybridL: 4.6, bevKwh: 16.0, defaultKm: 18_000 },
  goods: { petrolL: 11.5, dieselL: 12.8, hybridL: 9.4, bevKwh: 38.0, defaultKm: 32_000 },
  bus: { petrolL: 26.0, dieselL: 28.5, hybridL: 18.0, bevKwh: 110.0, defaultKm: 55_000 },
  hire: { petrolL: 8.4, dieselL: 7.0, hybridL: 5.1, bevKwh: 18.0, defaultKm: 42_000 },
  other: { petrolL: 14.0, dieselL: 16.0, hybridL: 11.0, bevKwh: 45.0, defaultKm: 12_000 },
}

export const STOCK_2023 = {
  total: 36_600_000,
  motorcar: 17_400_000,
  motorcycle: 16_900_000,
}

export const PRESETS: Array<{
  name: string
  engineCc: number
  fuel: FuelId
  seats: number
  unladenKg: number
  wheels: 2 | 3 | 4 | 6
  usage: UsageId
  year: number
}> = [
  {
    name: 'Perodua Axia (1.0)',
    engineCc: 998,
    fuel: 'petrol',
    seats: 5,
    unladenKg: 850,
    wheels: 4,
    usage: 'private',
    year: 2024,
  },
  {
    name: 'Honda RS150',
    engineCc: 150,
    fuel: 'petrol',
    seats: 2,
    unladenKg: 118,
    wheels: 2,
    usage: 'private',
    year: 2023,
  },
  {
    name: 'Isuzu NPR lorry',
    engineCc: 5193,
    fuel: 'diesel',
    seats: 3,
    unladenKg: 3200,
    wheels: 6,
    usage: 'commercial',
    year: 2022,
  },
  {
    name: 'Rapid KL bus',
    engineCc: 6700,
    fuel: 'diesel',
    seats: 40,
    unladenKg: 11000,
    wheels: 6,
    usage: 'public',
    year: 2021,
  },
  {
    name: 'Grab / e-hailing Bezza',
    engineCc: 1332,
    fuel: 'petrol',
    seats: 5,
    unladenKg: 965,
    wheels: 4,
    usage: 'public',
    year: 2025,
  },
  {
    name: 'Proton e.MAS 5',
    engineCc: 0,
    fuel: 'bev',
    seats: 5,
    unladenKg: 1680,
    wheels: 4,
    usage: 'private',
    year: 2025,
  },
]
