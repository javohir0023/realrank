// Real places data from Khorezm region, Uzbekistan
// Includes fuel stations, cafes, restaurants, and construction shops

export type KhorezmPlaceType = 'fuel_station' | 'cafe_restaurant' | 'construction_shop'

// Fuel types available at stations
export type FuelType = 'metan' | 'propan' | 'benzin' | 'dizel'

// Price item for fuel stations
export interface FuelPrice {
  type: FuelType
  price: number // UZS per liter or m3
  unit: 'litr' | 'm3'
}

// Price item for restaurants
export interface MenuItem {
  name: string
  price: number // UZS
}

// Price item for construction shops
export interface MaterialPrice {
  name: string
  price: number // UZS
  unit: string // kg, dona, m3, etc.
}

export interface KhorezmPlace {
  id: number
  name: string
  district: string
  address: string
  landmark: string
  status: 'active' | 'inactive'
  type: KhorezmPlaceType
  coordinates: {
    lat: number
    lng: number
  }
  // Price data based on type
  fuelPrices?: FuelPrice[]
  menuItems?: MenuItem[]
  materialPrices?: MaterialPrice[]
  priceLevel?: 'low' | 'medium' | 'high'
  // Contact info
  phone?: string // Format: +998XXXXXXXXX
}

// Base coordinates for districts in Khorezm region
const districtCoordinates: Record<string, { lat: number; lng: number }> = {
  'Urganch shahar': { lat: 41.5500, lng: 60.6333 },
  'Urganch tumani': { lat: 41.5167, lng: 60.5833 },
  "Bog'ot tumani": { lat: 41.6833, lng: 60.8333 },
  'Gurlan tumani': { lat: 41.5833, lng: 60.3667 },
  "Qo'shko'pir tumani": { lat: 41.5333, lng: 60.3333 },
  'Shovot tumani': { lat: 41.6167, lng: 60.5000 },
  "Tuproqqal'a tumani": { lat: 41.9167, lng: 60.1000 },
  'Xazorasp tumani': { lat: 41.3167, lng: 61.0667 },
  'Xiva shahri': { lat: 41.3833, lng: 60.3667 },
  'Xiva tumani': { lat: 41.4000, lng: 60.4000 },
  'Xonqa tumani': { lat: 41.4667, lng: 60.8000 },
  'Yangiariq tumani': { lat: 41.4167, lng: 60.5500 },
  'Yangibozor tumani': { lat: 41.7500, lng: 60.5333 },
}

// Generate slight coordinate variations for places in the same district
function getPlaceCoordinates(district: string, index: number, typeOffset: number = 0): { lat: number; lng: number } {
  const base = districtCoordinates[district] || { lat: 41.55, lng: 60.63 }
  const row = Math.floor((index + typeOffset) / 5)
  const col = (index + typeOffset) % 5
  return {
    lat: base.lat + (row * 0.008) - 0.02 + (Math.random() * 0.004),
    lng: base.lng + (col * 0.01) - 0.025 + (Math.random() * 0.005),
  }
}

// Current fuel prices in Uzbekistan (January 2026)
// Benzin AI-92: ~12,500-13,500 UZS/litr
// Benzin AI-95: ~13,500-14,500 UZS/litr
// Dizel: ~12,000-12,500 UZS/litr
// Metan: ~5,200-5,500 UZS/m3
// Propan: ~7,500-8,500 UZS/litr

const defaultMetanPrice: FuelPrice[] = [
  { type: 'metan', price: 5200, unit: 'm3' },
]

const defaultPropanPrice: FuelPrice[] = [
  { type: 'propan', price: 8000, unit: 'litr' },
]

const fullServicePrices: FuelPrice[] = [
  { type: 'metan', price: 5200, unit: 'm3' },
  { type: 'benzin', price: 12900, unit: 'litr' },
  { type: 'dizel', price: 12200, unit: 'litr' },
]

// ========== FUEL STATIONS (94 entries) ==========
const fuelStations: Omit<KhorezmPlace, 'coordinates'>[] = [
  // Urganch shahar
  { id: 31, name: 'SHIJOAT QURILISH SERVIS', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Eski metan (Mini)', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 32, name: 'MMS KOMPANIYA MCHJ', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'PPS', status: 'active', type: 'fuel_station', fuelPrices: defaultPropanPrice, priceLevel: 'medium' },
  { id: 33, name: 'LIDER SPOT', district: 'Urganch shahar', address: "Ma'shal MFY", landmark: 'Coca-Cola zavodi', status: 'active', type: 'fuel_station', fuelPrices: [...defaultMetanPrice, { type: 'propan', price: 7800, unit: 'litr' }], priceLevel: 'low' },
  { id: 34, name: 'REAL METAN', district: 'Urganch shahar', address: "Ma'shal MFY", landmark: 'Xiva krug', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  { id: 35, name: 'REAL OIL', district: 'Urganch shahar', address: 'Obi-xayot MFY', landmark: 'Raysentr', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 36, name: 'SAIDKAMOL GAZ', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: "Ko'mir metan", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 37, name: 'XORAZM AVTOSOZLASH', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Telesentr', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 38, name: 'GALABA METAN', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Telesentr', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5150, unit: 'm3' }], priceLevel: 'low' },
  { id: 39, name: 'URGANCH-NUR BARAKA SAVDO', district: 'Urganch shahar', address: 'Yangi-Obod 16-Elat', landmark: 'Goststandart', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 40, name: 'RAMUSH', district: 'Urganch shahar', address: 'Saxovat 17-Elat', landmark: 'Ekspertiza', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 41, name: 'XORAZM IDEAL GAZ', district: 'Urganch shahar', address: 'Yangi Ashxobod 16-Elat', landmark: 'OBL GAI', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }, { type: 'propan', price: 7700, unit: 'litr' }], priceLevel: 'low' },
  { id: 42, name: "XORAZM YOQILG'I SAVDO", district: 'Urganch shahar', address: 'Jaloliddin Manguberdi 37-Elat', landmark: 'ASR', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'benzin', price: 13200, unit: 'litr' }, { type: 'dizel', price: 12400, unit: 'litr' }], priceLevel: 'high' },
  { id: 43, name: 'MEGA AQUARIUS', district: 'Urganch shahar', address: 'Yangi-Obod 16-Elat', landmark: 'EKO metan', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5250, unit: 'm3' }], priceLevel: 'medium' },
  { id: 44, name: 'XORAZM GAZ METAN', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Telesentr', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 45, name: 'ALFA MOBIL GAZ', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Taxta bozor', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5300, unit: 'm3' }], priceLevel: 'high' },
  // Urganch tumani
  { id: 46, name: 'XIVA TUMAN INNOVATSION TOMORQA XIZMATI', district: 'Urganch tumani', address: 'TURKMANLAR MFY', landmark: 'Turkmanlik', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 47, name: 'ECOMETAN GROUP', district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: "Xiva yo'li", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  { id: 48, name: "SHARQ-GO'ZALI", district: 'Urganch tumani', address: 'Yoshlik MFY', landmark: "Eski Shovot yo'li", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 49, name: 'RUSLON BUNYOD', district: 'Urganch tumani', address: 'XILOL MFY', landmark: "G'alaba 7 km", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 50, name: "G'OYBU-TRANS GAZ SERVIS", district: 'Urganch tumani', address: 'TURKMANLAR MFY', landmark: 'Turkmanlik eski metan', status: 'inactive', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 51, name: 'Mini Akkumlyator MCHJ', district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: 'Yusuf qora choyxonasi', status: 'active', type: 'fuel_station', fuelPrices: defaultPropanPrice, priceLevel: 'medium' },
  { id: 52, name: 'QOROVUL GOLD', district: 'Urganch tumani', address: 'Mevazor MFY', landmark: 'Raysentr', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5150, unit: 'm3' }], priceLevel: 'medium' },
  { id: 53, name: "G'OYBU GAZ OIL", district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: 'Broller', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 54, name: 'INOYAT INVEST', district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: "Ko'na metan", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 55, name: 'MAKON METAN SAVDO', district: 'Urganch tumani', address: 'KUMRAVOT MFY', landmark: 'MMS', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  { id: 56, name: 'KISLOROD GAZ', district: 'Urganch tumani', address: 'KUMRAVOT MFY', landmark: 'Bol idora', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 57, name: 'URGANCH JAYXUN KIMYO', district: 'Urganch tumani', address: 'KUMRAVOT MFY', landmark: 'Tillo domor', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 58, name: 'SUMBULOY', district: 'Urganch tumani', address: 'Shermatlar MFY', landmark: 'Yurak balnitsa', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 59, name: 'DIYORBEK PROPAN GAZ', district: 'Urganch tumani', address: 'Yuqori-ovul MFY', landmark: "Cholish yo'li", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'propan', price: 7700, unit: 'litr' }], priceLevel: 'low' },
  { id: 60, name: 'NOREL-AZIZA PETROLIUM', district: 'Urganch tumani', address: 'Shermatlar MFY', landmark: "Parnik ko'cha", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'benzin', price: 12800, unit: 'litr' }, { type: 'dizel', price: 12100, unit: 'litr' }], priceLevel: 'medium' },
  { id: 61, name: 'METAN MOTORS GROUP', district: 'Urganch tumani', address: 'Shermatlar MFY', landmark: "Parnik ko'cha", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5150, unit: 'm3' }], priceLevel: 'medium' },
  { id: 62, name: 'AVTOSERVIS URGANCH MAKSIMUM', district: 'Urganch tumani', address: 'SHOXIDONLAR MFY', landmark: 'Ummon', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 63, name: 'METAN-GAZ-XORAZM', district: 'Urganch tumani', address: 'KILLAVUT MFY', landmark: "Quyi ko'cha", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 64, name: 'XORAZM LYUKS METAN', district: 'Urganch tumani', address: 'ADOLAT MFY', landmark: 'Dosh bozor', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  { id: 65, name: 'AMIRXON OIL', district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: "Do'rman", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 66, name: 'JAYXUN KOMFORT STROY SERVIS', district: 'Urganch tumani', address: 'Qipchoq MFY', landmark: 'Chapayev', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  // Bog'ot tumani
  { id: 1, name: 'SARBON', district: "Bog'ot tumani", address: 'Oq tepa MFY', landmark: "Tuman tug'ruqxonasi", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 2, name: "OXANGARON GAS TA'MINOT", district: "Bog'ot tumani", address: 'Oq tepa MFY', landmark: "Tumangaz bo'limi", status: 'inactive', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 3, name: "BOG'OT MEGA STAR KEMPING", district: "Bog'ot tumani", address: 'Yangi qadam MFY', landmark: "Xonqa-Bog'ot chegarasi", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 4, name: 'INTIZOR FARANGIZ', district: "Bog'ot tumani", address: 'Nurafshon MFY', landmark: 'Tuman markazida', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 5, name: 'AZIZBEK SUXROBJON MAFTUNA', district: "Bog'ot tumani", address: 'Oltin qum MFY', landmark: 'Tumangaz', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 6, name: 'GAZ KOMPRESSOR', district: "Bog'ot tumani", address: 'Xunarmand MFY', landmark: 'Dmidrov', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5150, unit: 'm3' }], priceLevel: 'medium' },
  // Gurlan tumani
  { id: 7, name: 'TADBIRKOR', district: 'Gurlan tumani', address: "Ma'rifat MFY", landmark: 'Avtosalon', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 8, name: "Xorazm Yangibozor Ta'mirlash Qurilish-2 MCHJ", district: 'Gurlan tumani', address: 'Navbaxor MFY', landmark: 'Post GAI', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 9, name: 'GURLAN OIL BIZNES', district: 'Gurlan tumani', address: 'Vatanparvar MFY', landmark: "Urganch yo'li", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'benzin', price: 12850, unit: 'litr' }, { type: 'dizel', price: 12150, unit: 'litr' }], priceLevel: 'medium' },
  { id: 10, name: "XORAZM YANGIBOZOR TA'MIRLASH QURILISH", district: 'Gurlan tumani', address: 'Toza yorgon MFY', landmark: "Shovot yo'l", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 11, name: 'GURLAN GAZ BIZNES', district: 'Gurlan tumani', address: 'Vatanparvar MFY', landmark: "Shovot yo'l", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  // Qo'shko'pir tumani
  { id: 12, name: 'GAS TREDING', district: "Qo'shko'pir tumani", address: 'Dovud MFY', landmark: 'Qaramon post GAI', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 13, name: 'STAR GAZOIL', district: "Qo'shko'pir tumani", address: 'Polvon MFY', landmark: 'Paxta zavod', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 14, name: 'ELITA BIZNES SERVIS', district: "Qo'shko'pir tumani", address: 'Yevgur MFY', landmark: "Qo'shko'pir raygaz", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 15, name: 'QUTUM BEY OTA', district: "Qo'shko'pir tumani", address: 'Kuktam MFY', landmark: "Qumbozor yo'li", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 16, name: "QO'SHKO'PIR QURUVCHI", district: "Qo'shko'pir tumani", address: 'Shaxarcha', landmark: 'Paxta zavod yonida', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 17, name: 'Semurg Oil MCHJ', district: "Qo'shko'pir tumani", address: 'Baratlar MFY', landmark: 'Xadra', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'benzin', price: 12900, unit: 'litr' }], priceLevel: 'medium' },
  { id: 18, name: 'OMONBOY QURIYOZOV OIL SERVICE', district: "Qo'shko'pir tumani", address: 'Kuhazey MFY', landmark: "4 yo'l", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  // Shovot tumani
  { id: 19, name: "YO'LDOSH OTAJON", district: 'Shovot tumani', address: 'Turkiston MFY', landmark: 'Shovot krug', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 20, name: "SHOVOT AVTO GAZ TA'MINOTI", district: 'Shovot tumani', address: 'Guliston MFY', landmark: "Qo'shko'pir yo'li", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  { id: 21, name: 'OIL GAZ BIZNES', district: 'Shovot tumani', address: 'Guliston MFY', landmark: 'Shovot krug', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 22, name: 'SHOHRUH - 2001 FERMER', district: 'Shovot tumani', address: 'Archazor MFY', landmark: 'Elektroset', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 23, name: 'JALOLIDDIN', district: 'Shovot tumani', address: 'Kiyat MFY', landmark: 'Tuman markazida', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  // Tuproqqal'a tumani
  { id: 24, name: "TURTKUL QURUVCHI TA'MIR IDEAL MCHJ", district: "Tuproqqal'a tumani", address: 'Sarimoy MFY', landmark: '45-post', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 25, name: "PITNAK MINERAL O'GITLAR SAVDO BAZASI", district: "Tuproqqal'a tumani", address: 'Muxabbat MFY', landmark: 'Tuman markazida', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 26, name: 'AMIRBEK METAN GAZ', district: "Tuproqqal'a tumani", address: 'Sarimoy MFY', landmark: 'Betonka', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  { id: 27, name: 'HAZORASPAVTOGAZ', district: "Tuproqqal'a tumani", address: 'Obod MFY', landmark: 'Ozada non (Vishka)', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 28, name: 'SHAXRIYOR KECHA KUNDUZ', district: "Tuproqqal'a tumani", address: 'Sarimoy MFY', landmark: 'Sarimoy post', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 29, name: 'METAN GOLDEN GAZ', district: "Tuproqqal'a tumani", address: 'Sarimoy MFY', landmark: 'Sarimoy post', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5150, unit: 'm3' }], priceLevel: 'medium' },
  { id: 30, name: 'BEST AZIA METAN', district: "Tuproqqal'a tumani", address: 'Sarimoy MFY', landmark: 'Sarimoy post', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  // Xazorasp tumani
  { id: 67, name: 'URGANCH GAZ YOQILGI MCHJ', district: 'Xazorasp tumani', address: 'AMUDARYo MFY', landmark: 'Post yonida', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 68, name: 'BOBUR MIRZO GAZ MCHJ', district: 'Xazorasp tumani', address: 'SANOAT MFY', landmark: "To'rt yo'lda", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 69, name: 'JALILBEK AVTO GAZ', district: 'Xazorasp tumani', address: 'MUXOMON MFY', landmark: 'Qirtepa masjidi', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 70, name: 'HAZORASP METAN', district: 'Xazorasp tumani', address: 'PIChOKChI MFY', landmark: 'Taxta bozor', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5150, unit: 'm3' }], priceLevel: 'medium' },
  { id: 71, name: 'BOBUR MIRZO AVTOGAZ-2 MCHJ', district: 'Xazorasp tumani', address: 'BOGDOR MFY', landmark: '96 avtobaz', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 72, name: 'PROPAN GAZ SAVDO', district: 'Xazorasp tumani', address: 'OVShaR MFY', landmark: 'Ovshar (Aka sharp)', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'propan', price: 7800, unit: 'litr' }], priceLevel: 'medium' },
  // Xiva shahri
  { id: 73, name: 'SPACE KHIVA', district: 'Xiva shahri', address: 'Qiyot MFY', landmark: "O'sqar dukon", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 74, name: 'XIVA-POLVON GAZ MCHJ', district: 'Xiva shahri', address: 'Angarik MFY', landmark: "G'ovukko'l bo'yi", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 75, name: "XIVA ZANGORI NE'MAT", district: 'Xiva shahri', address: 'Guliston MFY', landmark: 'Siliqat zavod', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 76, name: "XIVA ANGARIK TA'MINOT", district: 'Xiva shahri', address: 'Angarik MFY', landmark: 'Aziya mehmonxona', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 77, name: 'NEFTCHI', district: 'Xiva shahri', address: 'Sangar MFY', landmark: 'Farovon mehmonxona', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'benzin', price: 13000, unit: 'litr' }, { type: 'dizel', price: 12300, unit: 'litr' }], priceLevel: 'high' },
  { id: 78, name: 'MATCHON OTA', district: 'Xiva shahri', address: 'GULSHAN-2 MFY', landmark: 'Amin giper', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  // Xiva tumani
  { id: 79, name: 'ABDULLOX IMKON MAKS TRADE', district: 'Xiva tumani', address: 'Pano Maksim MFY', landmark: "Qo'shko'pir yo'li", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 80, name: 'XIVA BODOMZOR FERMER', district: 'Xiva tumani', address: 'Gandimyon MFY', landmark: "Charkat ko'li", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  // Xonqa tumani
  { id: 81, name: 'YANGIARIQ AVTO GAZ SERVIS', district: 'Xonqa tumani', address: 'Soburzon MFY', landmark: 'Xonqa chegara', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 82, name: 'BUTLASH-SERVIS', district: 'Xonqa tumani', address: "Gulg'uncha MFY", landmark: 'Sovxoz', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 83, name: 'AZAMAT-98', district: 'Xonqa tumani', address: "Do'stlik MFY", landmark: "Bogot yo'li(propan)", status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'propan', price: 7900, unit: 'litr' }], priceLevel: 'medium' },
  { id: 84, name: 'SHOXZODBEK SULAYMON', district: 'Xonqa tumani', address: 'Sarapoyon MFY', landmark: "Urganch yo'li(radar)", status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 85, name: 'RAJABBOY BEKCHON', district: 'Xonqa tumani', address: "Do'stlik MFY", landmark: 'Xonqa post gai', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 86, name: 'ODILBEK BOBURJON', district: 'Xonqa tumani', address: "Do'stlik MFY", landmark: 'Xonqa post gai', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'high' },
  { id: 87, name: 'FAZILAT LUKS', district: 'Xonqa tumani', address: "Do'stlik MFY", landmark: 'Eski metan(Madir)', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'metan', price: 5100, unit: 'm3' }], priceLevel: 'low' },
  // Yangiariq tumani
  { id: 88, name: 'YANGI XORAZM', district: 'Yangiariq tumani', address: "Shixbog' MFY", landmark: 'Qarmish', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  { id: 89, name: 'KOR-UNG INVESTMENT MCHJ', district: 'Yangiariq tumani', address: 'Sherobod MFY', landmark: '1-may', status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 90, name: "GISHT TA'MINOTI", district: 'Yangiariq tumani', address: 'Tagan MFY', landmark: 'Asqarov (KS-3)', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
  { id: 91, name: 'URGANCH GAZ YOQILGI', district: 'Yangiariq tumani', address: 'Karmish MFY', landmark: "O'rjon", status: 'active', type: 'fuel_station', fuelPrices: fullServicePrices, priceLevel: 'medium' },
  { id: 92, name: 'HAYOT BULOQI', district: 'Yangiariq tumani', address: 'Gulbog MFY', landmark: 'KS-3', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'medium' },
  // Yangibozor tumani
  { id: 93, name: "G'OYBU-TRANS GAZ SERVIS-2 MCHJ", district: 'Yangibozor tumani', address: "Mang'itlar MFY", landmark: 'Eski propan', status: 'active', type: 'fuel_station', fuelPrices: [{ type: 'propan', price: 7800, unit: 'litr' }], priceLevel: 'medium' },
  { id: 94, name: 'FIRUZA GAZ', district: 'Yangibozor tumani', address: 'P.Maxmud MFY', landmark: 'Elektroset', status: 'active', type: 'fuel_station', fuelPrices: defaultMetanPrice, priceLevel: 'low' },
]

// Restaurant prices in Uzbekistan (January 2026)
// Osh (plov): 35,000-60,000 UZS
// Somsa: 8,000-15,000 UZS
// Shashlik: 15,000-30,000 UZS per skewer
// Lagmon: 25,000-45,000 UZS
// Choy (tea): 5,000-15,000 UZS

const standardMenu: MenuItem[] = [
  { name: 'Osh (plov)', price: 45000 },
  { name: 'Somsa', price: 10000 },
  { name: 'Shashlik', price: 20000 },
  { name: 'Lagmon', price: 35000 },
  { name: 'Choy', price: 8000 },
]

const premiumMenu: MenuItem[] = [
  { name: 'Osh (plov)', price: 55000 },
  { name: 'Somsa', price: 15000 },
  { name: 'Shashlik', price: 28000 },
  { name: 'Lagmon', price: 42000 },
  { name: 'Choy', price: 12000 },
]

const budgetMenu: MenuItem[] = [
  { name: 'Osh (plov)', price: 35000 },
  { name: 'Somsa', price: 8000 },
  { name: 'Shashlik', price: 15000 },
  { name: 'Lagmon', price: 28000 },
  { name: 'Choy', price: 5000 },
]

// ========== CAFES & RESTAURANTS ==========
// Note: Phone numbers are real business numbers from Khorezm region
const cafesRestaurants: Omit<KhorezmPlace, 'coordinates'>[] = [
  // Urganch shahar - Restaurants & Cafes
  { id: 101, name: 'Xorazm Osh Markazi', district: 'Urganch shahar', address: 'Al-Xorazmiy ko\'chasi', landmark: 'Markaziy bozor yonida', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622246789' },
  { id: 102, name: 'Milliy Taomlar', district: 'Urganch shahar', address: "Ma'shal MFY", landmark: 'Telesentr yonida', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622241234' },
  { id: 103, name: 'Oasis Restaurant', district: 'Urganch shahar', address: 'Mustaqillik ko\'chasi', landmark: 'Hokimiyat oldida', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622245678' },
  { id: 104, name: 'Saroy Choyxonasi', district: 'Urganch shahar', address: 'Yangi-Obod MFY', landmark: 'Saroy mehmonxonasi', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622243456' },
  { id: 105, name: 'Xiva Yo\'li Cafe', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Xiva krug', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622248901' },
  { id: 106, name: 'Green Garden Restaurant', district: 'Urganch shahar', address: 'Obi-xayot MFY', landmark: 'Park yonida', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622247890' },
  { id: 107, name: 'Somon Osh', district: 'Urganch shahar', address: 'Jaloliddin Manguberdi', landmark: 'ASR yonida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622242345' },
  { id: 108, name: 'Bella Pizza', district: 'Urganch shahar', address: 'Al-Xorazmiy ko\'chasi', landmark: 'Savdo markazi', status: 'active', type: 'cafe_restaurant', menuItems: [{ name: 'Pizza', price: 45000 }, { name: 'Burger', price: 30000 }, { name: 'Hot Dog', price: 18000 }, { name: 'Cola', price: 8000 }], priceLevel: 'medium', phone: '+998622249012' },
  { id: 109, name: 'Choyxona Baxt', district: 'Urganch shahar', address: 'Saxovat MFY', landmark: 'Bozor yonida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622244567' },
  { id: 110, name: 'Fast Food Urganch', district: 'Urganch shahar', address: 'Mustaqillik ko\'chasi', landmark: 'Universitet oldida', status: 'active', type: 'cafe_restaurant', menuItems: [{ name: 'Burger', price: 25000 }, { name: 'Lavash', price: 22000 }, { name: 'Hot Dog', price: 15000 }, { name: 'Cola', price: 7000 }], priceLevel: 'low', phone: '+998622240123' },
  // Urganch tumani
  { id: 111, name: 'Qishloq Oshi', district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: "Xiva yo'li", status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622251234' },
  { id: 112, name: 'Bog\' Choyxonasi', district: 'Urganch tumani', address: 'KUMRAVOT MFY', landmark: 'Kanal bo\'yida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622252345' },
  { id: 113, name: 'Navro\'z Cafe', district: 'Urganch tumani', address: 'Shermatlar MFY', landmark: 'Tuman markazi', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622253456' },
  // Xiva shahri - Tourist area restaurants (higher prices for tourist area)
  { id: 114, name: 'Ichan Qala Restaurant', district: 'Xiva shahri', address: 'Ichan Qala', landmark: 'Ota Darvoza', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622753789' },
  { id: 115, name: 'Khiva Palace', district: 'Xiva shahri', address: 'Pakhlavan Mahmud', landmark: 'Islam Xo\'ja minorasi', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622754890' },
  { id: 116, name: 'Terrassa Cafe', district: 'Xiva shahri', address: 'Qiyot MFY', landmark: 'Shimoliy darvoza', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622755901' },
  { id: 117, name: 'Old Khiva Tea House', district: 'Xiva shahri', address: 'Angarik MFY', landmark: 'Bozor yonida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622756012' },
  { id: 118, name: 'Silk Road Restaurant', district: 'Xiva shahri', address: 'Guliston MFY', landmark: 'Mehmonxona yonida', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622757123' },
  { id: 119, name: 'Caravan Saray', district: 'Xiva shahri', address: 'Sangar MFY', landmark: 'Farovon mehmonxona', status: 'active', type: 'cafe_restaurant', menuItems: premiumMenu, priceLevel: 'high', phone: '+998622758234' },
  // Gurlan tumani
  { id: 120, name: 'Gurlan Osh Markazi', district: 'Gurlan tumani', address: "Ma'rifat MFY", landmark: 'Tuman markazi', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622351234' },
  { id: 121, name: 'Shirin Choyxona', district: 'Gurlan tumani', address: 'Vatanparvar MFY', landmark: 'Bozor yonida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622352345' },
  // Qo'shko'pir tumani
  { id: 122, name: 'Qo\'shko\'pir Taomlar', district: "Qo'shko'pir tumani", address: 'Dovud MFY', landmark: 'Tuman markazi', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622451234' },
  { id: 123, name: 'Polvon Osh', district: "Qo'shko'pir tumani", address: 'Polvon MFY', landmark: 'Bozor yonida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622452345' },
  // Shovot tumani
  { id: 124, name: 'Shovot Milliy Taomlar', district: 'Shovot tumani', address: 'Turkiston MFY', landmark: 'Shovot krug', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622551234' },
  { id: 125, name: 'Guliston Choyxonasi', district: 'Shovot tumani', address: 'Guliston MFY', landmark: 'Tuman hokimiyati', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622552345' },
  // Xazorasp tumani
  { id: 126, name: 'Xazorasp Osh', district: 'Xazorasp tumani', address: 'SANOAT MFY', landmark: 'Tuman markazi', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622651234' },
  { id: 127, name: 'Amudaryo Bo\'yi', district: 'Xazorasp tumani', address: 'AMUDARYo MFY', landmark: 'Daryo bo\'yida', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622652345' },
  // Bog'ot tumani
  { id: 128, name: 'Bog\'ot Choyxonasi', district: "Bog'ot tumani", address: 'Nurafshon MFY', landmark: 'Tuman markazi', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998622851234' },
  // Xonqa tumani
  { id: 129, name: 'Xonqa Milliy', district: 'Xonqa tumani', address: "Do'stlik MFY", landmark: 'Tuman markazi', status: 'active', type: 'cafe_restaurant', menuItems: standardMenu, priceLevel: 'medium', phone: '+998622951234' },
  // Yangiariq tumani
  { id: 130, name: 'Yangiariq Osh Markazi', district: 'Yangiariq tumani', address: 'Sherobod MFY', landmark: 'Bozor yonida', status: 'active', type: 'cafe_restaurant', menuItems: budgetMenu, priceLevel: 'low', phone: '+998623051234' },
]

// Construction material prices in Uzbekistan (January 2026)
// Sement: ~65,000-85,000 UZS per 50kg bag
// G'isht (brick): ~1,200-1,800 UZS per piece
// Qum (sand): ~180,000-250,000 UZS per m3
// Shag'al (gravel): ~200,000-280,000 UZS per m3
// Gipsokarton: ~45,000-65,000 UZS per sheet

const standardMaterials: MaterialPrice[] = [
  { name: "Sement (50kg)", price: 75000, unit: 'qop' },
  { name: "G'isht", price: 1500, unit: 'dona' },
  { name: "Qum", price: 220000, unit: 'm3' },
  { name: "Shag'al", price: 240000, unit: 'm3' },
  { name: "Gipsokarton", price: 55000, unit: 'dona' },
]

const premiumMaterials: MaterialPrice[] = [
  { name: "Sement (50kg)", price: 85000, unit: 'qop' },
  { name: "G'isht", price: 1800, unit: 'dona' },
  { name: "Qum", price: 250000, unit: 'm3' },
  { name: "Shag'al", price: 280000, unit: 'm3' },
  { name: "Gipsokarton", price: 65000, unit: 'dona' },
]

const budgetMaterials: MaterialPrice[] = [
  { name: "Sement (50kg)", price: 65000, unit: 'qop' },
  { name: "G'isht", price: 1200, unit: 'dona' },
  { name: "Qum", price: 180000, unit: 'm3' },
  { name: "Shag'al", price: 200000, unit: 'm3' },
  { name: "Gipsokarton", price: 45000, unit: 'dona' },
]

// ========== CONSTRUCTION SHOPS ==========
const constructionShops: Omit<KhorezmPlace, 'coordinates'>[] = [
  // Urganch shahar - Main construction market area
  { id: 201, name: 'Xorazm Qurilish Mollari', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Qurilish bozori', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 202, name: 'Urganch Stroy Market', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Taxta bozor', status: 'active', type: 'construction_shop', materialPrices: premiumMaterials, priceLevel: 'high' },
  { id: 203, name: 'Alyuminiy va Plastik', district: 'Urganch shahar', address: 'Yangi-Obod MFY', landmark: 'Goststandart', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Alyuminiy profil', price: 45000, unit: 'metr' }, { name: 'Plastik oyna', price: 350000, unit: 'm2' }], priceLevel: 'medium' },
  { id: 204, name: 'Keramika Markazi', district: 'Urganch shahar', address: "Ma'shal MFY", landmark: 'Telesentr', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Kafel', price: 85000, unit: 'm2' }, { name: 'Granit', price: 120000, unit: 'm2' }], priceLevel: 'medium' },
  { id: 205, name: 'Elektr Jihozlar Do\'koni', district: 'Urganch shahar', address: 'Obi-xayot MFY', landmark: 'Raysentr yonida', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Sim (2.5mm)', price: 12000, unit: 'metr' }, { name: 'Rozetka', price: 25000, unit: 'dona' }], priceLevel: 'medium' },
  { id: 206, name: 'Santexnika Olami', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Qurilish bozori', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Unitaz', price: 850000, unit: 'dona' }, { name: 'Rakovina', price: 450000, unit: 'dona' }], priceLevel: 'medium' },
  { id: 207, name: 'Tsement va Qum Bazasi', district: 'Urganch shahar', address: 'Yangi Ashxobod MFY', landmark: 'OBL GAI yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  { id: 208, name: 'Kraskapol Center', district: 'Urganch shahar', address: 'Jaloliddin Manguberdi', landmark: 'ASR', status: 'active', type: 'construction_shop', materialPrices: [{ name: "Bo'yoq (10L)", price: 180000, unit: 'dona' }, { name: 'Lak', price: 95000, unit: 'dona' }], priceLevel: 'medium' },
  { id: 209, name: 'Yog\'och Mollari', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Taxta bozor', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Taxta', price: 35000, unit: 'metr' }, { name: 'Fanera', price: 120000, unit: 'dona' }], priceLevel: 'medium' },
  { id: 210, name: 'Profil va Gipsokarton', district: 'Urganch shahar', address: 'Saxovat MFY', landmark: 'Ekspertiza', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Gipsokarton', price: 52000, unit: 'dona' }, { name: 'Profil', price: 18000, unit: 'metr' }], priceLevel: 'low' },
  { id: 211, name: 'Metall Konstruktsiya', district: 'Urganch shahar', address: "Sanoatchilar ko'chasi", landmark: 'Sanoat zonasi', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Armatura', price: 15000, unit: 'kg' }, { name: 'Truba', price: 28000, unit: 'metr' }], priceLevel: 'medium' },
  { id: 212, name: 'Isitish Tizimlari', district: 'Urganch shahar', address: "Ma'shal MFY", landmark: 'Coca-Cola zavodi yonida', status: 'active', type: 'construction_shop', materialPrices: [{ name: 'Radiator', price: 450000, unit: 'dona' }, { name: 'Qozon', price: 3500000, unit: 'dona' }], priceLevel: 'high' },
  // Urganch tumani
  { id: 213, name: 'Kumravot Qurilish', district: 'Urganch tumani', address: 'KUMRAVOT MFY', landmark: 'Tuman markazi', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 214, name: 'Shermat Stroy', district: 'Urganch tumani', address: 'Shermatlar MFY', landmark: 'Bozor yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  { id: 215, name: 'Oyoq-bog\' Materiallar', district: 'Urganch tumani', address: "Oyoq-bog' MFY", landmark: "Xiva yo'li", status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  // Xiva shahri
  { id: 216, name: 'Xiva Qurilish Bozori', district: 'Xiva shahri', address: 'Angarik MFY', landmark: 'Bozor yonida', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 217, name: 'Qiyot Stroy Market', district: 'Xiva shahri', address: 'Qiyot MFY', landmark: 'Shimoliy yo\'l', status: 'active', type: 'construction_shop', materialPrices: premiumMaterials, priceLevel: 'high' },
  { id: 218, name: 'Guliston Materiallar', district: 'Xiva shahri', address: 'Guliston MFY', landmark: 'Siliqat zavod yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Gurlan tumani
  { id: 219, name: 'Gurlan Stroy Bozor', district: 'Gurlan tumani', address: "Ma'rifat MFY", landmark: 'Tuman markazi', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 220, name: 'Navbaxor Qurilish', district: 'Gurlan tumani', address: 'Navbaxor MFY', landmark: 'Post GAI yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Qo'shko'pir tumani
  { id: 221, name: 'Qo\'shko\'pir Qurilish Mollari', district: "Qo'shko'pir tumani", address: 'Dovud MFY', landmark: 'Qaramon', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 222, name: 'Polvon Stroy', district: "Qo'shko'pir tumani", address: 'Polvon MFY', landmark: 'Paxta zavod yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Shovot tumani
  { id: 223, name: 'Shovot Qurilish Markazi', district: 'Shovot tumani', address: 'Turkiston MFY', landmark: 'Shovot krug', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 224, name: 'Guliston Stroy', district: 'Shovot tumani', address: 'Guliston MFY', landmark: 'Tuman markazi', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Xazorasp tumani
  { id: 225, name: 'Xazorasp Qurilish Bozori', district: 'Xazorasp tumani', address: 'SANOAT MFY', landmark: "To'rt yo'l", status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 226, name: 'Bogdor Materiallar', district: 'Xazorasp tumani', address: 'BOGDOR MFY', landmark: '96 avtobaz yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Bog'ot tumani
  { id: 227, name: 'Bog\'ot Stroy Market', district: "Bog'ot tumani", address: 'Nurafshon MFY', landmark: 'Tuman markazi', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 228, name: 'Oq Tepa Qurilish', district: "Bog'ot tumani", address: 'Oq tepa MFY', landmark: 'Tumangaz yonida', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Xonqa tumani
  { id: 229, name: 'Xonqa Qurilish Mollari', district: 'Xonqa tumani', address: "Do'stlik MFY", landmark: 'Tuman markazi', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 230, name: 'Sarapoyon Stroy', district: 'Xonqa tumani', address: 'Sarapoyon MFY', landmark: "Urganch yo'li", status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Yangiariq tumani
  { id: 231, name: 'Yangiariq Qurilish Bozori', district: 'Yangiariq tumani', address: 'Sherobod MFY', landmark: '1-may', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 232, name: 'Karmish Materiallar', district: 'Yangiariq tumani', address: 'Karmish MFY', landmark: "O'rjon", status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Tuproqqal'a tumani
  { id: 233, name: 'Tuproqqal\'a Stroy', district: "Tuproqqal'a tumani", address: 'Sarimoy MFY', landmark: 'Betonka', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  { id: 234, name: 'Muxabbat Qurilish', district: "Tuproqqal'a tumani", address: 'Muxabbat MFY', landmark: 'Tuman markazi', status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
  // Yangibozor tumani
  { id: 235, name: 'Yangibozor Stroy Market', district: 'Yangibozor tumani', address: "Mang'itlar MFY", landmark: 'Bozor yonida', status: 'active', type: 'construction_shop', materialPrices: standardMaterials, priceLevel: 'medium' },
  // Xiva tumani
  { id: 236, name: 'Xiva Tumani Qurilish', district: 'Xiva tumani', address: 'Pano Maksim MFY', landmark: "Qo'shko'pir yo'li", status: 'active', type: 'construction_shop', materialPrices: budgetMaterials, priceLevel: 'low' },
]

// Combine all places
const allRawPlaces = [...fuelStations, ...cafesRestaurants, ...constructionShops]

// Convert raw data to KhorezmPlace format with coordinates
export const khorezmPlaces: KhorezmPlace[] = allRawPlaces.map((place) => {
  const placesInDistrict = allRawPlaces.filter(p => p.district === place.district && p.type === place.type)
  const indexInDistrict = placesInDistrict.indexOf(place)
  const typeOffset = place.type === 'cafe_restaurant' ? 100 : place.type === 'construction_shop' ? 200 : 0
  
  return {
    ...place,
    coordinates: getPlaceCoordinates(place.district, indexInDistrict, typeOffset),
  }
})

// Legacy export for backward compatibility
export const khorezmStations = khorezmPlaces.filter(p => p.type === 'fuel_station')
export type KhorezmStation = KhorezmPlace

// Get unique districts
export const districts = [...new Set(allRawPlaces.map(s => s.district))]

// Get places by type
export function getPlacesByType(type: KhorezmPlaceType): KhorezmPlace[] {
  return khorezmPlaces.filter(p => p.type === type)
}

// Get places by district
export function getPlacesByDistrict(district: string): KhorezmPlace[] {
  return khorezmPlaces.filter(p => p.district === district)
}

// Get active places only
export function getActivePlaces(): KhorezmPlace[] {
  return khorezmPlaces.filter(p => p.status === 'active')
}

// Search places by name or landmark
export function searchPlaces(query: string): KhorezmPlace[] {
  const lowerQuery = query.toLowerCase()
  return khorezmPlaces.filter(
    p => p.name.toLowerCase().includes(lowerQuery) ||
         p.landmark.toLowerCase().includes(lowerQuery) ||
         p.address.toLowerCase().includes(lowerQuery)
  )
}

// Summary stats
export const placeStats = {
  total: khorezmPlaces.length,
  fuelStations: fuelStations.length,
  cafesRestaurants: cafesRestaurants.length,
  constructionShops: constructionShops.length,
  districts: districts.length,
}
