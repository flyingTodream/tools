import { Unit } from 'convert-units'
interface optType {
    label: string
    value: string
}
interface unitsType {
    [key: string]: optType[]
}

const units: unitsType = {
    length: [
        { label: 'mm (毫米)', value: 'mm' },
        { label: 'cm (厘米)', value: 'cm' },
        { label: 'm (米)', value: 'm' },
        { label: 'in (英寸)', value: 'in' },
        { label: 'mi (英里)', value: 'mi' },
        { label: 'ft (英尺)', value: 'ft' },
        { label: 'ft-us (美尺)', value: 'ft-us' },
    ],
    area: [
        { label: 'mm² (平方毫米)', value: 'mm2' },
        { label: 'cm² (平方厘米)', value: 'cm2' },
        { label: 'm² (平方米)', value: 'm2' },
        { label: 'ha (公顷)', value: 'ha' },
        { label: 'km² (平方千米)', value: 'km2' },
        { label: 'in² (平方英寸)', value: 'in2' },
        { label: 'ft² (平方英尺)', value: 'ft2' },
        { label: 'ac (英亩)', value: 'ac' },
        { label: 'mi² (平方英里)', value: 'mi2' },
    ],
    volume: [
        { label: 'mm³ (立方毫米)', value: 'mm3' },
        { label: 'cm³ (立方厘米)', value: 'cm3' },
        { label: 'm³ (立方米)', value: 'm3' },
        { label: 'ml (毫升)', value: 'ml' },
        { label: 'l (升)', value: 'l' },
        { label: 'kl (千升)', value: 'kl' },
        { label: 'km³ (立方千米)', value: 'km3' },
        { label: 'tsp (茶勺)', value: 'tsp' },
        { label: 'Tbs (茶匙)', value: 'Tbs' },
        { label: 'in³ (立方英寸)', value: 'in3' },
        { label: 'fl-oz (液盎司)', value: 'fl-oz' },
        { label: 'cup (杯)', value: 'cup' },
        { label: 'pnt (皮升)', value: 'pnt' },
        { label: 'qt (夸脱)', value: 'qt' },
        { label: 'gal (加仑)', value: 'gal' },
        { label: 'ft³ (立方英尺)', value: 'ft3' },
        { label: 'yd³ (立方码)', value: 'yd3' },
    ],
    mass: [
        { label: 'mg (毫克)', value: 'mg' },
        { label: 'g (克)', value: 'g' },
        { label: 'kg (千克)', value: 'kg' },
        { label: 't (吨)', value: 't' },
        { label: 'oz (盎司)', value: 'oz' },
        { label: 'lb (磅)', value: 'lb' },
        { label: 'mt (公吨)', value: 'mt' },
        { label: 'mcg (微克)', value: 'mcg' },
    ],
    temperature: [
        { label: 'C (摄氏度)', value: 'C' },
        { label: 'F (华氏度)', value: 'F' },
        { label: 'K (开尔文)', value: 'K' },
        { label: 'R (兰氏度)', value: 'R' },
    ],
    speed: [
        { label: 'm/s (米/秒)', value: 'm/s' },
        { label: 'km/h (千米/时)', value: 'km/h' },
        { label: 'm/h (米/时)', value: 'm/h' },
        { label: 'knot (海里/时)', value: 'knot' },
        { label: 'ft/s (英尺/秒)', value: 'ft/s' },
    ],
    time: [
        { label: 'ms (毫秒)', value: 'ms' },
        { label: 's (秒)', value: 's' },
        { label: 'min (分钟)', value: 'min' },
        { label: 'h (小时)', value: 'h' },
        { label: 'd (天)', value: 'd' },
        { label: 'week (周)', value: 'week' },
        { label: 'month (月)', value: 'month' },
        { label: 'year (年)', value: 'year' },
        { label: 'ns (纳秒)', value: 'ns' },
        { label: 'mu (微秒)', value: 'mu' },
    ],
    pressure: [
        { label: 'Pa (帕)', value: 'Pa' },
        { label: 'hPa (百帕)', value: 'hPa' },
        { label: 'kPa (千帕)', value: 'kPa' },
        { label: 'MPa (兆帕)', value: 'MPa' },
        { label: 'bar (巴)', value: 'bar' },
        { label: 'torr (托)', value: 'torr' },
        { label: 'psi (磅力/平方英尺)', value: 'psi' },
        { label: 'ksi (千磅力/平方英寸)', value: 'ksi' },
    ],
    digital: [
        { label: 'b (比特)', value: 'b' },
        { label: 'Kb (千比特)', value: 'Kb' },
        { label: 'Mb (兆比特)', value: 'Mb' },
        { label: 'Gb (太兆比特)', value: 'Gb' },
        { label: 'Tb (太比特)', value: 'Tb' },
        { label: 'B (字节)', value: 'B' },
        { label: 'KB (千字节)', value: 'KB' },
        { label: 'MB (兆字节)', value: 'MB' },
        { label: 'GB (千兆字节)', value: 'GB' },
        { label: 'TB (太字节)', value: 'TB' },
    ],
    energy: [
        { label: 'Wh (度)', value: 'Wh' },
        { label: 'mWh (毫瓦时)', value: 'mWh' },
        { label: 'kWh (千瓦时)', value: 'kWh' },
        { label: 'MWh (兆瓦时)', value: 'MWh' },
        { label: 'GWh (吉瓦时)', value: 'GWh' },
        { label: 'J (焦)', value: 'J' },
        { label: 'kJ (千焦)', value: 'kJ' },
    ],
    angle: [
        { label: 'deg (度)', value: 'deg' },
        { label: 'rad (弧度)', value: 'rad' },
        { label: 'grad (百分度)', value: 'grad' },
        { label: 'arcmin (弧分)', value: 'arcmin' },
        { label: 'arcsec (弧度秒)', value: 'arcsec' },
    ],
    frequency: [
        { label: 'Hz (赫)', value: 'Hz' },
        { label: 'mHz (毫赫)', value: 'mHz' },
        { label: 'kHz (千赫)', value: 'kHz' },
        { label: 'MHz (兆赫)', value: 'MHz' },
        { label: 'GHz (吉赫)', value: 'GHz' },
        { label: 'THz (太赫)', value: 'THz' },
        { label: 'rpm (转)', value: 'rpm' },
        { label: 'deg/s (角度/秒)', value: 'deg/s' },
        { label: 'rad/s (弧度/秒)', value: 'rad/s' },
    ],
}
const selectOpt = [
    { label: 'Length (长度)', value: 'length' },
    { label: 'Area (面积)', value: 'area' },
    { label: 'Volume (体积)', value: 'volume' },
    { label: 'Mass (质量)', value: 'mass' },
    { label: 'Temperature (温度)', value: 'temperature' },
    { label: 'Speed (速度)', value: 'speed' },
    { label: 'Time (时间)', value: 'time' },
    { label: 'Pressure (压力)', value: 'pressure' },
    { label: 'Digital (存储)', value: 'digital' },
    { label: 'Energy (能)', value: 'energy' },
    { label: 'Angle (角度)', value: 'angle' },
    { label: 'Frequency (频率)', value: 'frequency' },
]
const unitsE: unitsType = {
    length: [
        { label: 'm', value: 'm' },
        { label: 'mm', value: 'mm' },
        { label: 'cm', value: 'cm' },
        { label: 'in', value: 'in' },
        { label: 'mi', value: 'mi' },
        { label: 'ft', value: 'ft' },
        { label: 'ft-us', value: 'ft-us' },
    ],
    area: [
        { label: 'm²', value: 'm2' },
        { label: 'mm²', value: 'mm2' },
        { label: 'cm²', value: 'cm2' },
        { label: 'ha', value: 'ha' },
        { label: 'km²', value: 'km2' },
        { label: 'in²', value: 'in2' },
        { label: 'ft²', value: 'ft2' },
        { label: 'ac', value: 'ac' },
        { label: 'mi²', value: 'mi2' },
    ],
    volume: [
        { label: 'l', value: 'l' },
        { label: 'mm³', value: 'mm3' },
        { label: 'cm³', value: 'cm3' },
        { label: 'm³', value: 'm3' },
        { label: 'ml', value: 'ml' },
        { label: 'kl', value: 'kl' },
        { label: 'km³', value: 'km3' },
        { label: 'tsp', value: 'tsp' },
        { label: 'Tbs', value: 'Tbs' },
        { label: 'in³', value: 'in3' },
        { label: 'fl-oz', value: 'fl-oz' },
        { label: 'cup', value: 'cup' },
        { label: 'pnt', value: 'pnt' },
        { label: 'qt', value: 'qt' },
        { label: 'gal', value: 'gal' },
        { label: 'ft³', value: 'ft3' },
        { label: 'yd³', value: 'yd3' },
    ],
    mass: [
        { label: 'g', value: 'g' },
        { label: 'mg', value: 'mg' },
        { label: 'kg', value: 'kg' },
        { label: 'oz', value: 'oz' },
        { label: 'lb', value: 'lb' },
        { label: 'mt', value: 'mt' },
        { label: 'mcg', value: 'mcg' },
        { label: 't', value: 't' },
    ],
    temperature: [
        { label: 'C', value: 'C' },
        { label: 'F', value: 'F' },
        { label: 'K', value: 'K' },
        { label: 'R', value: 'R' },
    ],
    speed: [
        { label: 'm/s', value: 'm/s' },
        { label: 'km/h', value: 'km/h' },
        { label: 'm/h', value: 'm/h' },
        { label: 'knot', value: 'knot' },
        { label: 'ft/s', value: 'ft/s' },
    ],
    time: [
        { label: 'ms', value: 'ms' },
        { label: 's', value: 's' },
        { label: 'min', value: 'min' },
        { label: 'h', value: 'h' },
        { label: 'd', value: 'd' },
        { label: 'week', value: 'week' },
        { label: 'month', value: 'month' },
        { label: 'year', value: 'year' },
        { label: 'ns', value: 'ns' },
        { label: 'mu', value: 'mu' },
    ],
    pressure: [
        { label: 'Pa', value: 'Pa' },
        { label: 'hPa', value: 'hPa' },
        { label: 'kPa', value: 'kPa' },
        { label: 'MPa', value: 'MPa' },
        { label: 'bar', value: 'bar' },
        { label: 'torr', value: 'torr' },
        { label: 'psi', value: 'psi' },
        { label: 'ksi', value: 'ksi' },
    ],
    digital: [
        { label: 'b', value: 'b' },
        { label: 'Kb', value: 'Kb' },
        { label: 'Mb', value: 'Mb' },
        { label: 'Gb', value: 'Gb' },
        { label: 'Tb', value: 'Tb' },
        { label: 'B', value: 'B' },
        { label: 'KB', value: 'KB' },
        { label: 'MB', value: 'MB' },
        { label: 'GB', value: 'GB' },
        { label: 'TB', value: 'TB' },
    ],
    energy: [
        { label: 'Wh', value: 'Wh' },
        { label: 'mWh', value: 'mWh' },
        { label: 'kWh', value: 'kWh' },
        { label: 'MWh', value: 'MWh' },
        { label: 'GWh', value: 'GWh' },
        { label: 'J', value: 'J' },
        { label: 'kJ', value: 'kJ' },
    ],
    angle: [
        { label: 'deg', value: 'deg' },
        { label: 'rad', value: 'rad' },
        { label: 'grad', value: 'grad' },
        { label: 'arcmin', value: 'arcmin' },
        { label: 'arcsec', value: 'arcsec' },
    ],
    frequency: [
        { label: 'Hz', value: 'Hz' },
        { label: 'mHz', value: 'mHz' },
        { label: 'kHz', value: 'kHz' },
        { label: 'MHz', value: 'MHz' },
        { label: 'GHz', value: 'GHz' },
        { label: 'THz', value: 'THz' },
        { label: 'rpm', value: 'rpm' },
        { label: 'deg/s', value: 'deg/s' },
        { label: 'rad/s', value: 'rad/s' },
    ],
}
const selectOptE = [
    { label: 'length', value: 'length' },
    { label: 'area', value: 'area' },
    { label: 'volume', value: 'volume' },
    { label: 'mass', value: 'mass' },
    { label: 'temperature', value: 'temperature' },
    { label: 'speed', value: 'speed' },
    { label: 'time', value: 'time' },
    { label: 'pressure', value: 'pressure' },
    { label: 'digital', value: 'digital' },
    { label: 'energy', value: 'energy' },
    { label: 'angle', value: 'angle' },
    { label: 'frequency', value: 'frequency' },
]
const commonUnit = [
    { label: 'Length (长度)', value: 'length' },
    { label: 'Area (面积)', value: 'area' },
    { label: 'Volume (体积)', value: 'volume' },
    { label: 'Mass (质量)', value: 'mass' },
    { label: 'Temperature (温度)', value: 'temperature' },
    { label: 'Speed (速度)', value: 'speed' },
    { label: 'Time (时间)', value: 'time' },
    { label: 'Pressure (压力)', value: 'pressure' },
    { label: 'Digital (存储)', value: 'digital' },
    { label: 'Energy (能量)', value: 'energy' },
    { label: 'Angle (角度)', value: 'angle' },
    { label: 'Frequency (频率)', value: 'frequency' },
]
const unitEnum = [
    'mm',
    'cm',
    'm',
    'in',
    'ft-us',
    'ft',
    'mi',
    'mm²',
    'cm²',
    'm²',
    'ha',
    'km²',
    'in²',
    'ft²',
    'ac',
    'mi²',
    'mm³',
    'cm³',
    'ml',
    'l',
    'kl',
    'm³',
    'km³',
    'tsp',
    'Tbs',
    'in³',
    'fl-oz',
    'cup',
    'pnt',
    'qt',
    'gal',
    'ft³',
    'yd³',
    'mcg',
    'mg',
    'g',
    'kg',
    'oz',
    'lb',
    'mt',
    't',
    'C',
    'F',
    'K',
    'R',
    'm/s',
    'km/h',
    'm/h',
    'knot',
    'ft/s',
    'ns',
    'mu',
    'ms',
    's',
    'min',
    'h',
    'd',
    'week',
    'month',
    'year',
    'Pa',
    'hPa',
    'kPa',
    'MPa',
    'bar',
    'torr',
    'psi',
    'ksi',
    'b',
    'Kb',
    'Mb',
    'Gb',
    'Tb',
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
    'Wh',
    'mWh',
    'kWh',
    'MWh',
    'GWh',
    'J',
    'kJ',
    'deg',
    'rad',
    'grad',
    'arcmin',
    'arcsec',
    'Hz',
    'mHz',
    'kHz',
    'MHz',
    'GHz',
    'THz',
    'rpm',
    'deg/s',
    'rad/s',
]

const isUnit = (text: string): boolean => {
    return unitEnum.includes(text)
}
export { units, selectOpt, commonUnit, selectOptE, unitsE, unitEnum, isUnit }
