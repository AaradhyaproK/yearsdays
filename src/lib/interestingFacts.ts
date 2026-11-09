import { formatNumber, type SupportedLocale } from '../i18n/utils';

export interface InterestingFact {
  id: string;
  category: 'cosmic' | 'planetary' | 'biological' | 'astronomical';
  categoryLabel: string;
  headline: string;
  explanation: string;
  statValue: string;
  statLabel: string;
}

interface FactOptions {
  days: number;
  lang: SupportedLocale;
}

/**
 * Returns the single best, mathematically precise chronological insight
 * directly derived from the exact number of days calculated.
 */
export function getBestChronologicalFact({ days, lang }: FactOptions): InterestingFact {
  const safeDays = Math.max(1, Math.round(days || 1));
  const isEs = lang === 'es';
  const isPt = lang === 'pt';

  // Earth travels ~107,200 km/h around the Sun = 2,572,800 km/day
  const orbitalKm = safeDays * 2_572_800;
  const orbitalMillions = (orbitalKm / 1_000_000).toFixed(1);
  const orbitPercent = ((safeDays / 365.2422) * 100).toFixed(1);

  // Planetary periods
  const venusYears = (safeDays / 224.7).toFixed(1);
  const mercuryYears = (safeDays / 87.97).toFixed(1);
  const marsYears = (safeDays / 686.98).toFixed(1);

  // Lunar synodic months (29.53059 days)
  const lunarCycles = (safeDays / 29.53059).toFixed(1);

  // Light travel (25.902 billion km/day)
  const lightBillions = (safeDays * 25.902).toFixed(1);

  // Case 1: Over 1 year (>= 365 days) -> Earth's cosmic voyage in space
  if (safeDays >= 365) {
    const orbitCount = (safeDays / 365.25).toFixed(1);
    return {
      id: 'cosmic-orbit',
      category: 'cosmic',
      categoryLabel: isEs ? 'Perspectiva Cósmica' : isPt ? 'Perspectiva Cósmica' : 'Cosmic Perspective',
      headline: isEs
        ? `La Tierra ha navegado ${orbitalMillions} millones de km en este tiempo`
        : isPt
        ? `A Terra viajou ${orbitalMillions} milhões de km neste período`
        : `Earth traveled ${orbitalMillions} million km in this exact time`,
      explanation: isEs
        ? `En estos ${formatNumber(safeDays, lang)} días exactos, nuestro planeta se ha desplazado ${orbitalMillions} millones de kilómetros por el espacio en su órbita alrededor del Sol (a 107.200 km/h), completando ${orbitCount} órbitas solares completas.`
        : isPt
        ? `Nestes ${formatNumber(safeDays, lang)} dias exatos, nosso planeta percorreu ${orbitalMillions} milhões de quilômetros pelo espaço em sua translação ao redor do Sol (a 107.200 km/h), completando ${orbitCount} órbitas solares.`
        : `Across these exact ${formatNumber(safeDays, lang)} days, our planet traveled approximately ${orbitalMillions} million kilometers through space in its annual orbit around the Sun (cruising at 107,200 km/h), completing ${orbitCount} full solar orbits.`,
      statValue: `${orbitalMillions}M km`,
      statLabel: isEs ? 'Distancia orbital recorrida' : isPt ? 'Distância orbital percorrida' : 'Orbital distance traveled in space',
    };
  }

  // Case 2: Between 200 and 364 days -> Venus / Mercury orbital comparison + partial Earth orbit
  if (safeDays >= 200) {
    return {
      id: 'planetary-orbit',
      category: 'planetary',
      categoryLabel: isEs ? 'Mecánica Celeste' : isPt ? 'Mecânica Celeste' : 'Planetary Motion',
      headline: isEs
        ? `Equivale al ${orbitPercent}% de la órbita de la Tierra y a ${venusYears} años en Venus`
        : isPt
        ? `Equivale a ${orbitPercent}% da órbita da Terra e ${venusYears} anos em Vênus`
        : `Equals ${orbitPercent}% of Earth's solar orbit and ${venusYears} Venusian years`,
      explanation: isEs
        ? `Un intervalo de ${formatNumber(safeDays, lang)} días representa el ${orbitPercent}% del viaje anual de la Tierra alrededor del Sol (${orbitalMillions} millones de km recorridos). En Venus (año de 224,7 días), ya se ha completado más de un año planetario completo.`
        : isPt
        ? `O intervalo de ${formatNumber(safeDays, lang)} dias representa ${orbitPercent}% da translação anual da Terra ao redor do Sol (${orbitalMillions} milhões de km percorridos). Em Vênus (cujo ano dura 224,7 dias), mais de um ano planetário inteiro já transcorreu.`
        : `An interval of ${formatNumber(safeDays, lang)} days represents ${orbitPercent}% of Earth's annual circuit around the Sun (${orbitalMillions} million km traveled). On Venus (which orbits in 224.7 Earth days), more than an entire planetary year has already elapsed.`,
      statValue: `${orbitPercent}%`,
      statLabel: isEs ? 'De la órbita solar de la Tierra' : isPt ? 'Da órbita solar da Terra' : "Of Earth's annual solar journey",
    };
  }

  // Case 3: Between 88 and 199 days -> Mercury year threshold
  if (safeDays >= 88) {
    return {
      id: 'mercury-year',
      category: 'planetary',
      categoryLabel: isEs ? 'Tiempo Planetario' : isPt ? 'Tempo Planetário' : 'Planetary Time',
      headline: isEs
        ? `En este tiempo, Mercurio ha completado ${mercuryYears} años solares`
        : isPt
        ? `Neste período, Mercúrio completou ${mercuryYears} anos solares`
        : `In this time, Mercury completed ${mercuryYears} full planetary years`,
      explanation: isEs
        ? `Mercurio orbita el Sol en tan solo 87,97 días terrestres. Durante estos ${formatNumber(safeDays, lang)} días, Mercurio completó ${mercuryYears} vueltas completas al Sol, mientras la Tierra recorrió ${orbitalMillions} millones de km en el espacio.`
        : isPt
        ? `Mercúrio orbita o Sol em apenas 87,97 dias terrestres. Durante estes ${formatNumber(safeDays, lang)} dias, Mercúrio completou ${mercuryYears} voltas inteiras ao redor do Sol, enquanto a Terra percorreu ${orbitalMillions} milhões de km.`
        : `Mercury circles the Sun in just 87.97 Earth days. During these ${formatNumber(safeDays, lang)} days, Mercury completed ${mercuryYears} entire orbits around the Sun, while Earth traveled ${orbitalMillions} million km through space.`,
      statValue: `${mercuryYears} yrs`,
      statLabel: isEs ? 'Años en Mercurio' : isPt ? 'Anos em Mercúrio' : 'Mercurian solar years completed',
    };
  }

  // Case 4: Between 28 and 87 days -> Lunar synodic cycles
  if (safeDays >= 28) {
    return {
      id: 'lunar-cycles',
      category: 'astronomical',
      categoryLabel: isEs ? 'Ciclo Lunar' : isPt ? 'Ciclo Lunar' : 'Lunar Cycle',
      headline: isEs
        ? `La Luna completó ${lunarCycles} ciclos de fases en este intervalo`
        : isPt
        ? `A Lua completou ${lunarCycles} ciclos de fases neste intervalo`
        : `The Moon completed ${lunarCycles} full phase cycles in this interval`,
      explanation: isEs
        ? `La Luna tarda 29,53 días en pasar de una luna nueva a la siguiente (mes sinódico). En estos ${formatNumber(safeDays, lang)} días se han sucedido ${lunarCycles} lunaciones completas en el cielo nocturno, mientras la Tierra recorrió ${orbitalMillions} millones de km.`
        : isPt
        ? `A Lua leva 29,53 dias para ir de uma lua nova à seguinte (mês sinódico). Nestes ${formatNumber(safeDays, lang)} dias, ocorreram ${lunarCycles} lunações completas no céu, enquanto a Terra percorreu ${orbitalMillions} milhões de km.`
        : `It takes the Moon 29.53 days to cycle from one new moon to the next (synodic month). Over these ${formatNumber(safeDays, lang)} days, ${lunarCycles} full lunar cycles elapsed in the night sky as Earth traveled ${orbitalMillions} million km.`,
      statValue: `${lunarCycles}`,
      statLabel: isEs ? 'Lunaciones completas' : isPt ? 'Ciclos lunares completos' : 'Synodic lunar cycles completed',
    };
  }

  // Case 5: Less than 28 days -> Daily orbital speed & Earth rotation
  return {
    id: 'daily-orbital',
    category: 'cosmic',
    categoryLabel: isEs ? 'Velocidad Cósmica' : isPt ? 'Velocidade Cósmica' : 'Orbital Motion',
    headline: isEs
      ? `La Tierra recorrió ${orbitalMillions} millones de km a 107.200 km/h`
      : isPt
      ? `A Terra percorreu ${orbitalMillions} milhões de km a 107.200 km/h`
      : `Earth traversed ${orbitalMillions} million km at 107,200 km/h`,
    explanation: isEs
      ? `En solo ${formatNumber(safeDays, lang)} días, la Tierra completó ${formatNumber(safeDays, lang)} rotaciones sobre su eje y nos transportó ${orbitalMillions} millones de kilómetros por el espacio interplanetario a una velocidad orbital constante de 29,78 km/s.`
      : isPt
      ? `Em apenas ${formatNumber(safeDays, lang)} dias, a Terra completou ${formatNumber(safeDays, lang)} rotações em seu eixo e nos transportou ${orbitalMillions} milhões de quilômetros pelo espaço a 29,78 km/s.`
      : `In just ${formatNumber(safeDays, lang)} days, the Earth completed ${formatNumber(safeDays, lang)} full axial rotations and carried us across ${orbitalMillions} million kilometers through interplanetary space at 29.78 km/s.`,
    statValue: `${orbitalMillions}M km`,
    statLabel: isEs ? 'Distancia espacial recorrida' : isPt ? 'Distância percorrida no espaço' : 'Traversed through interplanetary space',
  };
}
