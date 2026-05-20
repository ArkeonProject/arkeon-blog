export type SalaryInputMode = "gross" | "net";

export type TerritoryKey =
  | "andalucia"
  | "aragon"
  | "asturias"
  | "baleares"
  | "canarias"
  | "cantabria"
  | "castilla_mancha"
  | "castilla_leon"
  | "cataluna"
  | "extremadura"
  | "galicia"
  | "la_rioja"
  | "madrid"
  | "murcia"
  | "valencia"
  | "ceuta"
  | "melilla"
  | "navarra"
  | "euskadi"
  | "comun";

export type AgeRange = "menor65" | "65-74" | "75+";

export interface CalculatorState {
  bruto: number;
  pagas: number;
  hijos: number;
  territorio: TerritoryKey;
  rangoEdad: AgeRange;
  netoObjetivoPaga: number;
  netTargetUnit: "pay" | "hour";
  employerMode: "it" | "custom";
  employerCustomRate: number;
}

export interface SalaryData {
  g: number;
  ss: number;
  tax: number;
  net: number;
  eff: number;
  tr: number;
  np: number;
  sp: number;
  ip: number;
  reduccionTrabajo: number;
  minimoPersonalFamiliar: number;
  efectoMinimo: number;
  cuotaAntesMinimo: number;
  cuotaTrasMinimo: number;
  deduccionCeutaMelilla: number;
  cuotaTrasDeduccionTerritorial: number;
  deduccionRentasBajas: number;
}

export interface TerritoryGroup {
  label: string;
  options: { value: TerritoryKey; label: string }[];
}

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const STATE_BRACKETS: TaxBracket[] = [
  { min: 0, max: 12450, rate: 0.095 },
  { min: 12450, max: 20200, rate: 0.12 },
  { min: 20200, max: 35200, rate: 0.15 },
  { min: 35200, max: 60000, rate: 0.185 },
  { min: 60000, max: 300000, rate: 0.225 },
  { min: 300000, max: Infinity, rate: 0.245 },
];

const CEUTA_MELILLA_SCALE: TaxBracket[] = [
  { min: 0, max: 12450, rate: 0.095 },
  { min: 12450, max: 20200, rate: 0.12 },
  { min: 20200, max: 35200, rate: 0.15 },
  { min: 35200, max: 60000, rate: 0.185 },
  { min: 60000, max: Infinity, rate: 0.225 },
];

const AUTONOMIC_SCALES: Record<TerritoryKey, TaxBracket[]> = {
  comun: [
    { min: 0, max: 12450, rate: 0.095 },
    { min: 12450, max: 20200, rate: 0.12 },
    { min: 20200, max: 35200, rate: 0.15 },
    { min: 35200, max: 60000, rate: 0.185 },
    { min: 60000, max: 300000, rate: 0.225 },
    { min: 300000, max: Infinity, rate: 0.225 },
  ],
  andalucia: [
    { min: 0, max: 13000, rate: 0.095 },
    { min: 13000, max: 21100, rate: 0.12 },
    { min: 21100, max: 35200, rate: 0.15 },
    { min: 35200, max: 60000, rate: 0.185 },
    { min: 60000, max: Infinity, rate: 0.225 },
  ],
  aragon: [
    { min: 0, max: 13072.5, rate: 0.095 },
    { min: 13072.5, max: 21210, rate: 0.12 },
    { min: 21210, max: 36960, rate: 0.15 },
    { min: 36960, max: 52500, rate: 0.185 },
    { min: 52500, max: 60000, rate: 0.205 },
    { min: 60000, max: 80000, rate: 0.23 },
    { min: 80000, max: 90000, rate: 0.24 },
    { min: 90000, max: 130000, rate: 0.25 },
    { min: 130000, max: Infinity, rate: 0.255 },
  ],
  asturias: [
    { min: 0, max: 12450, rate: 0.1 },
    { min: 12450, max: 17707.2, rate: 0.12 },
    { min: 17707.2, max: 33007.2, rate: 0.14 },
    { min: 33007.2, max: 53407.2, rate: 0.185 },
    { min: 53407.2, max: 70000, rate: 0.215 },
    { min: 70000, max: 90000, rate: 0.225 },
    { min: 90000, max: 175000, rate: 0.25 },
    { min: 175000, max: Infinity, rate: 0.255 },
  ],
  baleares: [
    { min: 0, max: 10000, rate: 0.09 },
    { min: 10000, max: 18000, rate: 0.1125 },
    { min: 18000, max: 30000, rate: 0.1425 },
    { min: 30000, max: 48000, rate: 0.175 },
    { min: 48000, max: 70000, rate: 0.19 },
    { min: 70000, max: 90000, rate: 0.2175 },
    { min: 90000, max: 120000, rate: 0.2275 },
    { min: 120000, max: 175000, rate: 0.2375 },
    { min: 175000, max: Infinity, rate: 0.2475 },
  ],
  canarias: [
    { min: 0, max: 13465, rate: 0.09 },
    { min: 13465, max: 19022, rate: 0.115 },
    { min: 19022, max: 35185, rate: 0.14 },
    { min: 35185, max: 56382, rate: 0.185 },
    { min: 56382, max: 91350, rate: 0.235 },
    { min: 91350, max: 121200, rate: 0.25 },
    { min: 121200, max: Infinity, rate: 0.26 },
  ],
  cantabria: [
    { min: 0, max: 13000, rate: 0.085 },
    { min: 13000, max: 21000, rate: 0.11 },
    { min: 21000, max: 35200, rate: 0.145 },
    { min: 35200, max: 60000, rate: 0.18 },
    { min: 60000, max: 90000, rate: 0.225 },
    { min: 90000, max: Infinity, rate: 0.245 },
  ],
  castilla_mancha: [
    { min: 0, max: 12450, rate: 0.095 },
    { min: 12450, max: 20200, rate: 0.12 },
    { min: 20200, max: 35200, rate: 0.15 },
    { min: 35200, max: 60000, rate: 0.185 },
    { min: 60000, max: Infinity, rate: 0.225 },
  ],
  castilla_leon: [
    { min: 0, max: 12450, rate: 0.09 },
    { min: 12450, max: 20200, rate: 0.12 },
    { min: 20200, max: 35200, rate: 0.14 },
    { min: 35200, max: 53407.2, rate: 0.185 },
    { min: 53407.2, max: Infinity, rate: 0.215 },
  ],
  cataluna: [
    { min: 0, max: 12450, rate: 0.105 },
    { min: 12450, max: 17707.2, rate: 0.12 },
    { min: 17707.2, max: 21000, rate: 0.14 },
    { min: 21000, max: 33007.2, rate: 0.15 },
    { min: 33007.2, max: 53407.2, rate: 0.188 },
    { min: 53407.2, max: 90000, rate: 0.215 },
    { min: 90000, max: 120000, rate: 0.235 },
    { min: 120000, max: 175000, rate: 0.245 },
    { min: 175000, max: Infinity, rate: 0.255 },
  ],
  extremadura: [
    { min: 0, max: 12450, rate: 0.08 },
    { min: 12450, max: 20200, rate: 0.1 },
    { min: 20200, max: 24200, rate: 0.16 },
    { min: 24200, max: 35200, rate: 0.175 },
    { min: 35200, max: 60000, rate: 0.21 },
    { min: 60000, max: 80200, rate: 0.235 },
    { min: 80200, max: 99200, rate: 0.24 },
    { min: 99200, max: 120200, rate: 0.245 },
    { min: 120200, max: Infinity, rate: 0.25 },
  ],
  galicia: [
    { min: 0, max: 12985.35, rate: 0.09 },
    { min: 12985.35, max: 21068.6, rate: 0.1165 },
    { min: 21068.6, max: 35200, rate: 0.149 },
    { min: 35200, max: 60000, rate: 0.184 },
    { min: 60000, max: Infinity, rate: 0.225 },
  ],
  la_rioja: [
    { min: 0, max: 12450, rate: 0.08 },
    { min: 12450, max: 20200, rate: 0.106 },
    { min: 20200, max: 35200, rate: 0.136 },
    { min: 35200, max: 40000, rate: 0.178 },
    { min: 40000, max: 50000, rate: 0.183 },
    { min: 50000, max: 60000, rate: 0.19 },
    { min: 60000, max: 120000, rate: 0.245 },
    { min: 120000, max: Infinity, rate: 0.27 },
  ],
  madrid: [
    { min: 0, max: 13362.22, rate: 0.085 },
    { min: 13362.22, max: 19004.63, rate: 0.107 },
    { min: 19004.63, max: 35425.68, rate: 0.128 },
    { min: 35425.68, max: 57320.4, rate: 0.174 },
    { min: 57320.4, max: Infinity, rate: 0.205 },
  ],
  murcia: [
    { min: 0, max: 12450, rate: 0.095 },
    { min: 12450, max: 20200, rate: 0.112 },
    { min: 20200, max: 34000, rate: 0.133 },
    { min: 34000, max: 60000, rate: 0.179 },
    { min: 60000, max: Infinity, rate: 0.225 },
  ],
  valencia: [
    { min: 0, max: 12000, rate: 0.09 },
    { min: 12000, max: 22000, rate: 0.12 },
    { min: 22000, max: 32000, rate: 0.15 },
    { min: 32000, max: 42000, rate: 0.175 },
    { min: 42000, max: 52000, rate: 0.2 },
    { min: 52000, max: 62000, rate: 0.225 },
    { min: 62000, max: 72000, rate: 0.25 },
    { min: 72000, max: 100000, rate: 0.265 },
    { min: 100000, max: 150000, rate: 0.275 },
    { min: 150000, max: 200000, rate: 0.285 },
    { min: 200000, max: Infinity, rate: 0.295 },
  ],
  ceuta: CEUTA_MELILLA_SCALE,
  melilla: CEUTA_MELILLA_SCALE,
  navarra: [
    { min: 0, max: 12450, rate: 0.09 },
    { min: 12450, max: 20200, rate: 0.11 },
    { min: 20200, max: 35200, rate: 0.13 },
    { min: 35200, max: 60000, rate: 0.16 },
    { min: 60000, max: 120000, rate: 0.2 },
    { min: 120000, max: Infinity, rate: 0.24 },
  ],
  euskadi: [
    { min: 0, max: 12450, rate: 0.09 },
    { min: 12450, max: 20200, rate: 0.115 },
    { min: 20200, max: 35200, rate: 0.14 },
    { min: 35200, max: 60000, rate: 0.18 },
    { min: 60000, max: 300000, rate: 0.22 },
    { min: 300000, max: Infinity, rate: 0.24 },
  ],
};

export const TERRITORY_GROUPS: TerritoryGroup[] = [
  {
    label: "Comunidades de régimen común",
    options: [
      { value: "andalucia", label: "Andalucía" },
      { value: "aragon", label: "Aragón" },
      { value: "asturias", label: "Asturias" },
      { value: "baleares", label: "Illes Balears" },
      { value: "canarias", label: "Canarias" },
      { value: "cantabria", label: "Cantabria" },
      { value: "castilla_mancha", label: "Castilla-La Mancha" },
      { value: "castilla_leon", label: "Castilla y León" },
      { value: "cataluna", label: "Cataluña" },
      { value: "extremadura", label: "Extremadura" },
      { value: "galicia", label: "Galicia" },
      { value: "la_rioja", label: "La Rioja" },
      { value: "madrid", label: "Madrid" },
      { value: "murcia", label: "Murcia" },
      { value: "valencia", label: "Comunitat Valenciana" },
    ],
  },
  {
    label: "Ciudades autónomas",
    options: [
      { value: "ceuta", label: "Ceuta" },
      { value: "melilla", label: "Melilla" },
    ],
  },
  {
    label: "Regímenes forales",
    options: [
      { value: "navarra", label: "Navarra (Foral, aprox.)" },
      { value: "euskadi", label: "País Vasco (Foral, aprox.)" },
    ],
  },
];

export const BASE_GROSS_RANGE_MAX = 300000;
export const MAX_SUPPORTED_GROSS = 1500000;
export const GROSS_INPUT_STEP = 100;
export const NET_TARGET_INPUT_STEP = 1;
export const ANNUAL_WORK_HOURS_IT = 2080;
export const EMPLOYER_SS_RATE_IT_APPROX = 0.3207;

const SS_RATE = 0.0648;
const SS_MAX_ANUAL = 58914;
const GASTOS_DEDUCIBLES = 2000;
const MINIMO_PERSONAL_BASE = 5550;
const REDUCCION_TRABAJO_TRAMO1 = 14852;
const REDUCCION_TRABAJO_TRAMO2 = 17673.52;
const REDUCCION_TRABAJO_TRAMO3 = 19747.5;
const REDUCCION_TRABAJO_MAX = 7302;
const REDUCCION_TRABAJO_BASE_TRAMO3 = 2364.34;
const DEDUCCION_SMI_2026_MAX = 590.89;
const DEDUCCION_SMI_2026_TRAMO1 = 17094;
const DEDUCCION_SMI_2026_TRAMO2 = 20048.45;
const DEDUCCION_CEUTA_MELILLA_RATE = 0.6;

// Fiscal reference snapshot for this calculator:
// - AEAT IRPF (escala estatal + escalas autonómicas del manual y tablas públicas,
//   actualización consolidada hasta 2025)
// - Cotización trabajador a la Seguridad Social: 6,48% con base máxima anual aplicada
// IMPORTANT: keep this block updated whenever fiscal rules change.
export const FISCAL_RULES_LAST_REVIEW = "2026-05";

export interface EmployerCostData {
  employerSS: number;
  totalCompanyCost: number;
  employerRate: number;
}

export function calculateEmployerCostIT(bruto: number, employerRate = EMPLOYER_SS_RATE_IT_APPROX): EmployerCostData {
  const safeRate = Math.min(1, Math.max(0, employerRate || 0));
  const annualBase = Math.min(Math.max(bruto, 0), SS_MAX_ANUAL);
  const employerSS = annualBase * safeRate;
  return {
    employerSS,
    totalCompanyCost: bruto + employerSS,
    employerRate: safeRate,
  };
}

export function calculateHourlyRates(brutoAnual: number, netoAnual: number) {
  const grossPerHour = brutoAnual / ANNUAL_WORK_HOURS_IT;
  const netPerHour = netoAnual / ANNUAL_WORK_HOURS_IT;
  return {
    grossPerHour,
    netPerHour,
    annualHours: ANNUAL_WORK_HOURS_IT,
  };
}

export function fmtMoney(n: number): string {
  return `${Math.round(n).toLocaleString("es-ES")} €`;
}

export function pct(n: number): string {
  return `${((n || 0) * 100).toFixed(1)}%`;
}

function reduccionRendimientosTrabajo(rendimientoNetoParaReduccion: number): number {
  if (rendimientoNetoParaReduccion <= REDUCCION_TRABAJO_TRAMO1) return REDUCCION_TRABAJO_MAX;
  if (rendimientoNetoParaReduccion <= REDUCCION_TRABAJO_TRAMO2) {
    return Math.max(0, REDUCCION_TRABAJO_MAX - 1.75 * (rendimientoNetoParaReduccion - REDUCCION_TRABAJO_TRAMO1));
  }
  if (rendimientoNetoParaReduccion <= REDUCCION_TRABAJO_TRAMO3) {
    return Math.max(
      0,
      REDUCCION_TRABAJO_BASE_TRAMO3 - 1.14 * (rendimientoNetoParaReduccion - REDUCCION_TRABAJO_TRAMO2)
    );
  }
  return 0;
}

function deduccionRentasBajas2026(brutoAnual: number): number {
  if (brutoAnual <= DEDUCCION_SMI_2026_TRAMO1) return DEDUCCION_SMI_2026_MAX;
  if (brutoAnual <= DEDUCCION_SMI_2026_TRAMO2) {
    return Math.max(0, DEDUCCION_SMI_2026_MAX - 0.2 * (brutoAnual - DEDUCCION_SMI_2026_TRAMO1));
  }
  return 0;
}

function minimoPorDescendientes(hijos: number): number {
  if (hijos === 0) return 0;
  const tabla = [0, 2400, 2700, 4000, 4500];
  let total = 0;
  for (let i = 1; i <= Math.min(hijos, 4); i += 1) total += tabla[i];
  if (hijos > 4) total += (hijos - 4) * 4500;
  return total;
}

function minimoPorEdad(rangoEdad: AgeRange): number {
  if (rangoEdad === "75+") return 8100;
  if (rangoEdad === "65-74") return 6700;
  return MINIMO_PERSONAL_BASE;
}

function aplicaDeduccionCeutaMelilla(territorio: TerritoryKey): boolean {
  return territorio === "ceuta" || territorio === "melilla";
}

function calcularCuotaProgresiva(baseLiquidable: number, tramos: TaxBracket[]): number {
  if (baseLiquidable <= 0) return 0;
  let total = 0;
  for (let i = 0; i < tramos.length; i += 1) {
    const tramo = tramos[i];
    const prevMax = i === 0 ? 0 : tramos[i - 1].max;
    const inicioTramo = Math.max(tramo.min, prevMax);
    if (baseLiquidable <= inicioTramo) break;
    const limite = Math.min(baseLiquidable, tramo.max);
    const baseTramo = limite - inicioTramo;
    if (baseTramo > 0) total += baseTramo * tramo.rate;
  }
  return total;
}

function calcularIRPF(baseLiquidable: number, escalaKey: TerritoryKey): number {
  const escala = AUTONOMIC_SCALES[escalaKey] || AUTONOMIC_SCALES.comun;
  return calcularCuotaProgresiva(baseLiquidable, STATE_BRACKETS) + calcularCuotaProgresiva(baseLiquidable, escala);
}

function calcularCuotaTrasMinimo(baseLiquidable: number, minimoPersonalFamiliar: number, escalaKey: TerritoryKey) {
  const cuotaAntesMinimo = calcularIRPF(baseLiquidable, escalaKey);
  const efectoMinimo = calcularIRPF(Math.min(baseLiquidable, minimoPersonalFamiliar), escalaKey);
  return {
    cuotaAntesMinimo,
    efectoMinimo,
    cuotaTrasMinimo: Math.max(0, cuotaAntesMinimo - efectoMinimo),
  };
}

export function calcularSalario(bruto: number, hijos = 0, territorio: TerritoryKey = "comun", rangoEdad: AgeRange = "menor65"): SalaryData {
  if (!bruto || bruto <= 0) {
    return {
      g: 0,
      ss: 0,
      tax: 0,
      net: 0,
      eff: 0,
      tr: 0,
      np: 0,
      sp: 0,
      ip: 0,
      reduccionTrabajo: 0,
      minimoPersonalFamiliar: 0,
      efectoMinimo: 0,
      cuotaAntesMinimo: 0,
      cuotaTrasMinimo: 0,
      deduccionCeutaMelilla: 0,
      cuotaTrasDeduccionTerritorial: 0,
      deduccionRentasBajas: 0,
    };
  }
  const ss = Math.min(bruto, SS_MAX_ANUAL) * SS_RATE;
  const rendimientoNetoPrevio = Math.max(0, bruto - ss - GASTOS_DEDUCIBLES);
  const rendimientoNetoParaReduccion = Math.max(0, bruto - ss);
  const reduccionTrabajo = Math.min(rendimientoNetoPrevio, reduccionRendimientosTrabajo(rendimientoNetoParaReduccion));
  const minimoDesc = minimoPorDescendientes(hijos);
  const minimoEdad = minimoPorEdad(rangoEdad);
  const minimoPersonalFamiliar = minimoEdad + minimoDesc;
  const baseLiquidable = Math.max(0, rendimientoNetoPrevio - reduccionTrabajo);

  const { cuotaAntesMinimo, efectoMinimo, cuotaTrasMinimo } = calcularCuotaTrasMinimo(baseLiquidable, minimoPersonalFamiliar, territorio);

  const deduccionCeutaMelilla = aplicaDeduccionCeutaMelilla(territorio) ? cuotaTrasMinimo * DEDUCCION_CEUTA_MELILLA_RATE : 0;
  const cuotaTrasDeduccionTerritorial = Math.max(0, cuotaTrasMinimo - deduccionCeutaMelilla);
  const deduccionRentasBajas = Math.min(cuotaTrasDeduccionTerritorial, deduccionRentasBajas2026(bruto));
  const tax = Math.max(0, cuotaTrasDeduccionTerritorial - deduccionRentasBajas);
  const net = bruto - ss - tax;
  return {
    g: bruto,
    ss,
    tax,
    net,
    eff: (ss + tax) / bruto,
    tr: tax / bruto,
    np: net / bruto,
    sp: ss / bruto,
    ip: tax / bruto,
    reduccionTrabajo,
    minimoPersonalFamiliar,
    efectoMinimo,
    cuotaAntesMinimo,
    cuotaTrasMinimo,
    deduccionCeutaMelilla,
    cuotaTrasDeduccionTerritorial,
    deduccionRentasBajas,
  };
}

export function createCalculatorState(overrides: Partial<CalculatorState> = {}): CalculatorState {
  return {
    bruto: 24000,
    pagas: 12,
    hijos: 0,
    territorio: "andalucia",
    rangoEdad: "menor65",
    netoObjetivoPaga: 0,
    netTargetUnit: "pay",
    employerMode: "it",
    employerCustomRate: EMPLOYER_SS_RATE_IT_APPROX,
    ...overrides,
  };
}

export function roundToStep(value: number, step: number): number {
  return Math.round((Number(value) || 0) / step) * step;
}

function roundUpToStep(value: number, step: number): number {
  return Math.ceil((Number(value) || 0) / step) * step;
}

export function clampAnnualGross(value: number, max = MAX_SUPPORTED_GROSS): number {
  return Math.min(max, Math.max(0, Number(value) || 0));
}

function getMaxNetTargetPerPay(state: CalculatorState): number {
  const maxData = calcularSalario(MAX_SUPPORTED_GROSS, state.hijos, state.territorio, state.rangoEdad);
  return Math.max(0, Math.floor(maxData.net / state.pagas));
}

export function clampNetTargetPerPay(value: number, state: CalculatorState): number {
  return Math.min(getMaxNetTargetPerPay(state), Math.max(0, Number(value) || 0));
}

function estimateGrossFromNetTarget(targetNetPerPay: number, state: CalculatorState): number {
  const targetAnnualNet = Math.max(0, Number(targetNetPerPay) || 0) * state.pagas;
  if (targetAnnualNet <= 0) return 0;

  let low = 0;
  let high = Math.min(MAX_SUPPORTED_GROSS, Math.max(BASE_GROSS_RANGE_MAX, roundUpToStep(targetAnnualNet, GROSS_INPUT_STEP)));
  let highNet = calcularSalario(high, state.hijos, state.territorio, state.rangoEdad).net;

  while (high < MAX_SUPPORTED_GROSS && highNet < targetAnnualNet) {
    low = high;
    high = Math.min(MAX_SUPPORTED_GROSS, high * 2);
    highNet = calcularSalario(high, state.hijos, state.territorio, state.rangoEdad).net;
  }

  let bestGross = high;
  let bestDiff = Math.abs(highNet - targetAnnualNet);
  for (let i = 0; i < 40; i += 1) {
    const mid = (low + high) / 2;
    const midNet = calcularSalario(mid, state.hijos, state.territorio, state.rangoEdad).net;
    const diff = Math.abs(midNet - targetAnnualNet);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestGross = mid;
    }
    if (midNet < targetAnnualNet) low = mid;
    else high = mid;
  }

  const candidateGrosses = Array.from(
    new Set([
      clampAnnualGross(roundToStep(low, GROSS_INPUT_STEP)),
      clampAnnualGross(roundToStep(high, GROSS_INPUT_STEP)),
      clampAnnualGross(roundToStep(bestGross, GROSS_INPUT_STEP)),
      clampAnnualGross(Math.floor(bestGross / GROSS_INPUT_STEP) * GROSS_INPUT_STEP),
      clampAnnualGross(Math.ceil(bestGross / GROSS_INPUT_STEP) * GROSS_INPUT_STEP),
    ])
  );

  let closestGross = candidateGrosses[0] || 0;
  let closestDiff = Infinity;
  candidateGrosses.forEach((candidateGross) => {
    const candidateNet = calcularSalario(candidateGross, state.hijos, state.territorio, state.rangoEdad).net;
    const candidateDiff = Math.abs(candidateNet - targetAnnualNet);
    if (candidateDiff < closestDiff) {
      closestDiff = candidateDiff;
      closestGross = candidateGross;
    }
  });
  return closestGross;
}

export function syncNetTargetFromGross(state: CalculatorState): SalaryData {
  state.bruto = clampAnnualGross(state.bruto);
  const data = calcularSalario(state.bruto, state.hijos, state.territorio, state.rangoEdad);
  state.netoObjetivoPaga = clampNetTargetPerPay(roundToStep(data.net / state.pagas, NET_TARGET_INPUT_STEP), state);
  return data;
}

export function syncGrossFromNetTarget(state: CalculatorState): SalaryData {
  state.netoObjetivoPaga = clampNetTargetPerPay(roundToStep(state.netoObjetivoPaga, NET_TARGET_INPUT_STEP), state);
  state.bruto = estimateGrossFromNetTarget(state.netoObjetivoPaga, state);
  return calcularSalario(state.bruto, state.hijos, state.territorio, state.rangoEdad);
}
