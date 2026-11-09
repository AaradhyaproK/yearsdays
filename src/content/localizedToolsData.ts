export interface ToolSection {
  title: string;
  paragraphs: string[];
  cards?: { title: string; desc: string }[];
  bulletPoints?: string[];
}

export interface ToolLocalizedData {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  sections: ToolSection[];
  faqs: { q: string; a: string }[];
}

export const localizedToolsContent: Record<string, Record<string, ToolLocalizedData>> = {
  'days-between-dates': {
    es: {
      title: 'Calculadora de Días Entre Dos Fechas - Duración',
      description: 'Calcula con precisión días exactos, semanas hábiles y calendario entre dos fechas. Cálculo bisiesto sin registro y 100% privado.',
      heading: 'Calculadora de Días Entre Dos Fechas',
      subheading: 'Calcula el número exacto de días naturales, semanas, días hábiles de lunes a viernes y fines de semana entre dos fechas.',
      sections: [
        {
          title: 'Cómo Calcular Días Entre Dos Fechas con Precisión',
          paragraphs: [
            'El cálculo de intervalos entre dos fechas del calendario es un requisito habitual en la gestión de plazos administrativos, oposiciones oficiales, liquidaciones de intereses, contratos de alquiler y planificación laboral.',
            'Un cálculo superficial suele generar desajustes debido a la duración variable de los meses gregorianos (28 a 31 días), la presencia de años bisiestos y los desfases provocados por el cambio de hora oficial. Nuestra calculadora procesa cada fecha en marcas horarias UTC fijas a medianoche, garantizando exactitud matemática absoluta.',
          ],
        },
        {
          title: 'Cómputo Inclusivo vs. Exclusivo de Días',
          paragraphs: [
            'En el ámbito jurídico y administrativo en España y Latinoamérica, es crucial distinguir entre el cómputo de duración y el cómputo de días naturales:',
          ],
          cards: [
            {
              title: 'Cómputo Exclusivo (Duración)',
              desc: 'Cuenta el número de noches o intervalos de 24 horas transcurridos (por ejemplo, del 1 al 3 de mayo son 2 días de duración). Habitual en reservas hoteleras y vencimientos financieros.',
            },
            {
              title: 'Cómputo Inclusivo (Días de Calendario)',
              desc: 'Incluye tanto el día inicial como el día final en el total (del 1 al 3 de mayo son 3 días naturales). Es el estándar exigido en convocatorias de empleo público, permisos y plazos procesales.',
            },
          ],
        },
        {
          title: 'Días Hábiles en Oposiciones y Contratos',
          paragraphs: [
            'Nuestra herramienta desglosa automáticamente los días laborales de lunes a viernes respecto a los sábados y domingos.',
            'Aviso legal: En oposiciones de la función pública y plazos administrativos autonómicos o estatales, los días inhábiles también suelen incluir festivos locales o nacionales oficiales. Consulta siempre las bases de la convocatoria correspondiente.',
          ],
        },
      ],
      faqs: [
        {
          q: '¿Cómo se calcula el número exacto de días entre dos fechas?',
          a: 'Se transforman ambas fechas en marcas de tiempo UTC a medianoche para evitar desfases por cambio de hora. Luego se calcula la diferencia en milisegundos y se divide entre 86.400.000 (milisegundos en 24 horas).',
        },
        {
          q: '¿El cálculo incluye el día inicial y el final?',
          a: 'Nuestra calculadora muestra tanto los días transcurridos (exclusivo) como el cómputo inclusivo (+1 día), permitiéndote adaptarte a las exigencias de contratos o convocatorias oficiales.',
        },
        {
          q: '¿Cómo se contabilizan los años bisiestos en el intervalo?',
          a: 'Si el periodo entre ambas fechas abarca el 29 de febrero de un año bisiesto (como 2024 o 2028), ese día se suma de forma íntegra como un día natural adicional.',
        },
        {
          q: '¿Por qué no es exacto dividir el total de días entre 30 para saber los meses?',
          a: 'Porque los meses tienen entre 28 y 31 días. Una división estándar genera discrepancias acumuladas; nuestra herramienta respeta el calendario gregoriano real.',
        },
        {
          q: '¿Se almacenan las fechas ingresadas en algún servidor?',
          a: 'No. Todos los cómputos se ejecutan localmente en el navegador. Ninguna fecha sale de tu dispositivo ni se almacena en cookies o bases de datos.',
        },
      ],
    },
    pt: {
      title: 'Calculadora de Dias Entre Duas Datas - Duração',
      description: 'Calcule dias exatos, dias úteis e semanas entre duas datas no calendário. Totalmente privado, sem cookies e com ajuste de ano bissexto.',
      heading: 'Calculadora de Dias Entre Duas Datas',
      subheading: 'Calcule o número exato de dias corridos, semanas, dias úteis (segunda a sexta) e finais de semana entre duas datas.',
      sections: [
        {
          title: 'Como Calcular Intervalos Entre Datas com Exatidão',
          paragraphs: [
            'Calcular a distância entre duas datas do calendário é uma necessidade diária na contagem de prazos processuais (Código de Processo Civil), prazos de posse em concursos públicos, períodos de carência do INSS e contratos de locação.',
            'Cálculos manuais frequentemente incorrem em erros de contagem devido à variação de dias nos meses (28 a 31 dias) e ao impacto dos anos bissextos. Nossa plataforma processa datas na marca UTC de meia-noite, eliminando imprecisões decorrentes de fuso horário ou horário de verão.',
          ],
        },
        {
          title: 'Contagem Corrida vs. Dias Úteis (CPC e Concursos)',
          paragraphs: [
            'No Brasil, a forma de contagem varia conforme a natureza da relação jurídica:',
          ],
          cards: [
            {
              title: 'Dias Corridos (Prazo Material)',
              desc: 'Comum em contratos civis, vencimento de aluguéis e licenças. Conta todos os dias sem interrupção de fins de semana.',
            },
            {
              title: 'Dias Úteis (Prazos Processuais CPC)',
              desc: 'O CPC/2015 estabelece que a contagem de prazos processuais ocorre exclusivamente em dias úteis. Nossa ferramenta separa de imediato sábados e domingos.',
            },
          ],
        },
        {
          title: 'Regras de Anos Bissextos e Prazos Decadenciais',
          paragraphs: [
            'Sempre que o intervalo cruza o dia 29 de fevereiro em anos bissextos (como 2024 ou 2028), o dia é computado integralmente.',
            'Aviso de responsabilidade: Para feriados nacionais, estaduais ou municipais e recesso forense, consulte sempre o calendário oficial do tribunal ou o edital do concurso público aplicável.',
          ],
        },
      ],
      faqs: [
        {
          q: 'Como calcular o número exato de dias entre duas datas?',
          a: 'As datas são convertidas para o fuso UTC à meia-noite. A diferença de milissegundos é dividida por 86.400.000, resultando no número exato de dias sem erros de horário de verão.',
        },
        {
          q: 'A calculadora inclui o primeiro e o último dia?',
          a: 'Exibimos tanto a duração de tempo decorrido quanto a contagem inclusiva (+1 dia), atendendo tanto a cálculos de permanência quanto a prazos estatuários.',
        },
        {
          q: 'Como são calculados os dias úteis?',
          a: 'O sistema avalia cada dia do intervalo e separa automaticamente os sábados e domingos, indicando os dias úteis de trabalho de segunda a sexta-feira.',
        },
        {
          q: 'Os anos bissextos são calculados automaticamente?',
          a: 'Sim. Todo dia 29 de fevereiro presente no intervalo é considerado como um dia corrido completo pelo motor matemático.',
        },
        {
          q: 'Meus dados e datas ficam gravados?',
          a: 'Não. Todos os cálculos ocorrem de forma 100% cliente-side no seu navegador. Nenhuma data é transmitida a servidores ou gravada em cookies.',
        },
      ],
    },
  },
  'days-alive': {
    es: {
      title: 'Calculadora de Días Vividos - Total de Días',
      description: 'Calcula cuántos días, horas y minutos has vivido en la Tierra. Descubre cuándo cumples 10.000 días y tus hitos métricos de vida.',
      heading: 'Calculadora de Días Vividos',
      subheading: 'Descubre el número exacto de días, horas y minutos que has vivido en la Tierra y sigue tus próximos hitos métricos de existencia.',
      sections: [
        {
          title: '¿Cuántos Días He Vivido? La Perspectiva de la Edad Métrica',
          paragraphs: [
            'Aunque la sociedad celebra los cumpleaños solares cada 365 días, medir la propia vida en días totales ofrece una cronología ininterrumpida y fascinante.',
            'Una persona de 30 años ha vivido aproximadamente 10.957 días, superando las 263.000 horas y más de 1.000 millones de latidos cardíacos. Calcular los días vividos convierte el paso del tiempo en un hito tangible y medible.',
          ],
        },
        {
          title: 'Grandes Hitos Métricos de la Vida Humana',
          paragraphs: [
            'Frente al tradicional cumpleaños anual, los hitos métricos representan momentos clave de reflexión y celebración:',
          ],
          cards: [
            {
              title: '10.000 Días de Vida',
              desc: 'Se alcanza aproximadamente a los 27 años y 4 meses de edad. Es el primer gran umbral de cinco dígitos de la juventud.',
            },
            {
              title: '15.000 Días de Vida',
              desc: 'Se celebra en torno a los 41 años y 1 mes. Marca la consolidación de la madurez y más de 360.000 horas transcurridas.',
            },
            {
              title: '20.000 Días de Vida',
              desc: 'Se alcanza a los 54 años y 9 meses. Representa un jubileo métrico de casi cinco décadas y media de experiencias.',
            },
          ],
        },
        {
          title: 'Precisión frente a Estimaciones Casuales',
          paragraphs: [
            'Muchas calculadoras imprecisas se limitan a multiplicar la edad por 365 o 365,25. Ese cálculo arroja errores de varios días porque no tiene en cuenta la distribución real de años bisiestos vividos ni los límites de mes gregoriano.',
            'Nuestra herramienta evalúa la fecha exacta de nacimiento a medianoche UTC para asegurar un conteo riguroso de cada 24 horas de tu vida.',
          ],
        },
      ],
      faqs: [
        {
          q: '¿Cómo se calcula el total de días vividos?',
          a: 'Se calcula la diferencia entre la fecha de nacimiento y la fecha actual en marcas temporales UTC, dividiendo entre 86.400.000 milisegundos diarios.',
        },
        {
          q: '¿Cuándo se cumplen 10.000 días de vida?',
          a: 'Aproximadamente a los 27 años, 4 meses y 16 días de edad, según los años bisiestos transcurridos en tu ciclo vital.',
        },
        {
          q: '¿Se tienen en cuenta los días 29 de febrero bisiestos?',
          a: 'Sí. Cada día 29 de febrero transcurrido desde tu nacimiento se suma como un día completo de 24 horas en tu registro de días vividos.',
        },
        {
          q: '¿Cómo se calcula la estimación de latidos y respiraciones?',
          a: 'Se calcula a partir del total de minutos vividos utilizando promedios fisiológicos de reposo en adultos sanos (70–80 latidos/min y 12–20 respiraciones/min). Es una aproximación orientativa.',
        },
        {
          q: '¿Queda registrada mi fecha de nacimiento?',
          a: 'En absoluto. El cálculo se ejecuta 100% en tu navegador y la fecha nunca se almacena ni se transmite.',
        },
      ],
    },
    pt: {
      title: 'Calculadora de Dias Vividos - Quantos Dias Viveu',
      description: 'Descubra quantos dias, horas e minutos você viveu na Terra. Calcule o marco de 10.000 dias e suas batidas cardíacas estimadas.',
      heading: 'Calculadora de Dias Vividos',
      subheading: 'Descubra exatamente quantos dias, horas e minutos você já viveu na Terra e acompanhe seus próximos grandes marcos métricos de vida.',
      sections: [
        {
          title: 'Quantos Dias Já Vivi? A Cronologia da Idade Métrica',
          paragraphs: [
            'Tradicionalmente celebramos aniversários solares a cada 365 dias, quando a Terra completa sua órbita. No entanto, contar a existência em dias corridos proporciona uma visão contínua e inspiradora da nossa trajetória.',
            'Aos 30 anos de idade, uma pessoa já viveu cerca de 10.957 dias, ultrapassando 263 mil horas e mais de 1 bilhão de batimentos cardíacos. Cada amanhecer adiciona um novo marco métrico ao seu histórico de vida.',
          ],
        },
        {
          title: 'Marcos Métricos de Existência para Comemorar',
          paragraphs: [
            'A celebração de marcos de dias vem conquistando adeptos pelo mundo como momentos especiais de reflexão pessoal:',
          ],
          cards: [
            {
              title: '10.000 Dias de Vida',
              desc: 'Alcançado por volta dos 27 anos e 4 meses. Representa o primeiro grande patamar de cinco dígitos na vida adulta.',
            },
            {
              title: '15.000 Dias de Vida',
              desc: 'Comemorado por volta dos 41 anos e 1 mês. Um momento expressivo de maturidade e projetos consolidados.',
            },
            {
              title: '20.000 Dias de Vida',
              desc: 'Atingido aos 54 anos e 9 meses. Um verdadeiro jubileu métrico com quase 55 órbitas solares completadas.',
            },
          ],
        },
        {
          title: 'Cálculo Preciso vs. Aproximações Simplórias',
          paragraphs: [
            'Multiplicar simplesmente a idade por 365 gera erros cumulativos de 7 a 10 dias por ignorar os anos bissextos específicos vivenciados por cada geração.',
            'Nossa ferramenta processa os dias reais decorridos no calendário gregoriano com precisão UTC, garantindo o resultado exato.',
          ],
        },
      ],
      faqs: [
        {
          q: 'Como calcular quantos dias eu já vivi?',
          a: 'Calcula-se o intervalo entre o dia de nascimento e hoje em milissegundos UTC, dividindo por 86.400.000 ms (24 horas exatas).',
        },
        {
          q: 'Com quantos anos se completa 10.000 dias de vida?',
          a: 'Aproximadamente aos 27 anos, 4 meses e 16 dias de vida, variando ligeiramente com a contagem de anos bissextos.',
        },
        {
          q: 'Os anos bissextos entram na contagem dos dias vividos?',
          a: 'Sim. Cada dia 29 de fevereiro vivido é contado integralmente como um dia a mais de existência.',
        },
        {
          q: 'As estimativas de batimentos cardíacos são precisas?',
          a: 'São estimativas biológicas baseadas no ritmo cardíaco de repouso médio de adultos saudáveis (70 a 80 bpm). Servem como curiosidade e reflexão.',
        },
        {
          q: 'Minha data de nascimento é compartilhada ou enviada?',
          a: 'Não. Toda a computação roda localmente no seu dispositivo. Nenhuma informação é transmitida pela internet.',
        },
      ],
    },
  },
  'add-subtract-days': {
    es: {
      title: 'Sumar o Restar Días a una Fecha - Calculadora',
      description: 'Calcula la fecha resultante al sumar o restar días, semanas o meses a cualquier fecha con ajuste de bisiestos y fin de mes.',
      heading: 'Sumar o Restar Días a una Fecha',
      subheading: 'Calcula la fecha futura o pasada sumando o restando días, semanas, meses o años con ajuste riguroso de años bisiestos y fin de mes.',
      sections: [
        {
          title: 'Cálculo de Desplazamiento de Fechas y Vencimientos',
          paragraphs: [
            'Sumar o restar un intervalo de tiempo a una fecha del calendario es una de las operaciones más frecuentes en plazos judiciales, recursos administrativos, periodos de garantía de compra, visados de viaje y planificación de proyectos.',
            'Debido a que los meses tienen 28, 29, 30 o 31 días y los años alternan entre 365 y 366 días, calcular una fecha límite mentalmente suele provocar errores costosos.',
          ],
        },
        {
          title: 'Casos Prácticos en el Ámbito Legal y Administrativo',
          paragraphs: [
            'En España y países hispanohablantes, los plazos de notificación y vigencia exigen fechas exactas:',
          ],
          cards: [
            {
              title: 'Plazos de Recursos y Alegaciones',
              desc: 'Plazos habituales de 10, 15 o 30 días hábiles o naturales para interponer recursos ante la administración pública o tribunales.',
            },
            {
              title: 'Visados y Regla de 90 Días',
              desc: 'Permisos de estancia turística y visados Schengen con límites continuos de 90 días en cualquier periodo de 180 días.',
            },
            {
              title: 'Garantías y Desistimiento',
              desc: 'Periodos de desistimiento legal de 14 días en compras online y garantías contractuales de 2 o 3 años.',
            },
          ],
        },
        {
          title: 'El Ajuste de Fin de Mes (Clamping)',
          paragraphs: [
            'Cuando se suma un mes a fechas situadas en los días 29, 30 o 31, el mes de destino puede no tener tantos días (por ejemplo, sumar 1 mes al 31 de enero no puede dar 31 de febrero).',
            'Nuestra calculadora implementa la regla estándar internacional: la fecha se ajusta automáticamente al último día válido de dicho mes (28 o 29 de febrero), impidiendo desbordamientos incorrectos hacia marzo.',
          ],
        },
      ],
      faqs: [
        {
          q: '¿Qué fecha será dentro de 30, 60 o 90 días?',
          a: 'Introduce la fecha de inicio, selecciona "Sumar", indica el número de días y la herramienta te devolverá la fecha exacta del calendario junto con el día de la semana correspondiente.',
        },
        {
          q: '¿Cómo funciona sumar un mes al 31 de enero?',
          a: 'Al no existir el 31 de febrero, el cálculo se ajusta al último día válido de febrero: el día 28 en años comunes y el 29 en años bisiestos.',
        },
        {
          q: '¿Se pueden restar días para calcular fechas pasadas?',
          a: 'Sí. Cambia la operación a "Restar" para calcular plazos de prescripción retrospectiva, fechas de concepción o auditorías contractuales pasadas.',
        },
        {
          q: '¿Afecta el cambio de hora de verano al cálculo de días?',
          a: 'No. El cálculo se realiza por días de calendario UTC, de modo que sumar 1 día siempre avanza exactamente una casilla de calendario sin desfases de horas.',
        },
        {
          q: '¿Es privado este cálculo?',
          a: 'Sí, es 100% cliente-side. Tus fechas no se envían a ningún servidor ni se guardan en el historial del navegador.',
        },
      ],
    },
    pt: {
      title: 'Somar ou Subtrair Dias de uma Data - Calculadora',
      description: 'Calcule a data futura ou passada somando ou subtraindo dias, semanas ou meses com ajuste preciso de fim de mês e bissextos.',
      heading: 'Somar ou Subtrair Dias de uma Data',
      subheading: 'Calcule a data de destino somando ou subtraindo dias, semanas, meses ou anos com ajuste de fim de mês e anos bissextos.',
      sections: [
        {
          title: 'Operações de Deslocamento de Datas e Vencimentos',
          paragraphs: [
            'Adicionar ou subtrair períodos a partir de uma data de referência é indispensável na contagem de prazos recursais, prazos de posse em concursos públicos, vigência de aluguéis e períodos de carência de planos de saúde ou INSS.',
            'Como os meses possuem extensões desiguais de 28 a 31 dias, fazer essa contagem de cabeça costuma gerar o erro do "dia seguinte" ou "dia anterior", comprometendo prazos improrrogáveis.',
          ],
        },
        {
          title: 'Aplicações no Cotidiano Jurídico e Administrativo no Brasil',
          paragraphs: [
            'Diferentes normas brasileiras utilizam prazos estipulados em dias:',
          ],
          cards: [
            {
              title: 'Prazos do Direito do Consumidor',
              desc: 'Direito de arrependimento de 7 dias para compras online (CDC art. 49) e prazo de 30 ou 90 dias para reclamar vícios aparentes.',
            },
            {
              title: 'Prazos Contratuais e Aluguel',
              desc: 'Notificações prévias de desocupação de imóvel (habitualmente 30 dias corridos conforme Lei do Inquilinato).',
            },
            {
              title: 'Contratos e Férias Trabalhistas',
              desc: 'Aviso prévio proporcional (30 dias mais 3 dias por ano trabalhado, até o limite de 90 dias pela CLT).',
            },
          ],
        },
        {
          title: 'Ajuste de Fim de Mês em Cálculos Mensais',
          paragraphs: [
            'Ao somar 1 mês ao dia 31 de março, o mês seguinte possui apenas 30 dias (abril). A ferramenta aplica a regra de limite (clamping), travando a data resultante em 30 de abril sem pular para 1º de maio.',
            'Da mesma forma, somar prazos mensais com vencimento em fevereiro ajusta rigorosamente para 28 ou 29 conforme o ano.',
          ],
        },
      ],
      faqs: [
        {
          q: 'Que data será daqui a 30, 60 ou 90 dias?',
          a: 'Basta escolher a data inicial, selecionar "Somar", digitar a quantidade de dias e o sistema calcula a data exata e o dia da semana resultante.',
        },
        {
          q: 'O que acontece ao somar 1 mês ao dia 31 de janeiro?',
          a: 'A data é ajustada para o último dia válido de fevereiro: dia 28 em anos regulares ou dia 29 em anos bissextos.',
        },
        {
          q: 'É possível subtrair dias para localizar datas no passado?',
          a: 'Sim. Selecione a opção "Subtrair" para verificar prazos prescricionais, retroatividade fiscal ou datas de eventos pretéritos.',
        },
        {
          q: 'O horário de verão interfere no cálculo de dias?',
          a: 'Não. Os cálculos usam numeração de dias de calendário UTC, garantindo que 1 dia represente sempre um avanço de calendário completo.',
        },
        {
          q: 'Os cálculos e datas ficam registrados no site?',
          a: 'Não. A execução é exclusivamente local no seu navegador. Nenhuma data é gravada ou coletada.',
        },
      ],
    },
  },
  'birthday-countdown': {
    es: {
      title: 'Cuenta Atrás Próximo Cumpleaños - Contador en Vivo',
      description: 'Cuenta atrás en tiempo real de días, horas, minutos y segundos para tu próximo cumpleaños. Conoce en qué día de la semana caerá.',
      heading: 'Cuenta Atrás para el Próximo Cumpleaños',
      subheading: 'Contador en tiempo real de días, horas, minutos y segundos restantes para tu cumpleaños, con calendario de días de la semana futuros.',
      sections: [
        {
          title: '¿Cuánto Falta para Mi Cumpleaños? El Reloj de Retorno Solar',
          paragraphs: [
            'El cumpleaños marca el instante astronómico en el que la Tierra completa una vuelta alrededor del Sol respecto a la posición natal. Nuestro contador en vivo calcula la diferencia en tiempo real hasta la medianoche de tu próximo día festivo.',
            'El cronómetro se actualiza cada segundo y cuenta con optimización de rendimiento: cuando minimizas el navegador o cambias de pestaña, el intervalo se suspende automáticamente para no gastar batería, sincronizándose al volver.',
          ],
        },
        {
          title: '¿Por Qué el Cumpleaños Cambia de Día de la Semana?',
          paragraphs: [
            'Un año común tiene 365 días, lo que equivale exactamente a 52 semanas completas más 1 día suelto. Por este motivo, tu cumpleaños se desplaza 1 día de la semana hacia adelante cada año normal (por ejemplo, de lunes a martes).',
            'En los años bisiestos de 366 días (52 semanas y 2 días), el cumpleaños salta 2 días de la semana (de miércoles a viernes), un fenómeno conocido como desfase de salto de año.',
          ],
        },
        {
          title: 'Cumpleaños Hito en la Vida Personal',
          paragraphs: [
            'Determinadas edades conllevan cambios legales y sociales de gran trascendencia:',
          ],
          cards: [
            {
              title: '18 Años (Mayoría de Edad)',
              desc: 'Adquisición de la plena capacidad de obrar civil, derecho de voto en elecciones, obtención del carnet de conducir e independencia contractual.',
            },
            {
              title: 'Décadas Redondas (30, 40, 50)',
              desc: 'Momentos clave de balance vital, madurez profesional y celebraciones generacionales destacadas.',
            },
            {
              title: 'Edad de Jubilación (65 a 67 Años)',
              desc: 'Acceso a la pensión pública de jubilación en España y países comunitarios según los años cotizados a la Seguridad Social.',
            },
          ],
        },
      ],
      faqs: [
        {
          q: '¿Cuántos días faltan exactamente para mi cumpleaños?',
          a: 'Introduce tu fecha de nacimiento y verás al instante los días, horas, minutos y segundos restantes hasta tu próximo cumpleaños.',
        },
        {
          q: '¿Cómo se calcula el cumpleaños si nací el 29 de febrero?',
          a: 'En los años no bisiestos, la cuenta atrás toma como referencia el 28 de febrero (o el 1 de marzo según preferencia). En los años bisiestos apunta directamente al 29 de febrero.',
        },
        {
          q: '¿El contador consume batería en el móvil?',
          a: 'No. Integra un detector de visibilidad que detiene el bucle de actualización cuando la pantalla está apagada o la pestaña oculta.',
        },
        {
          q: '¿En qué día de la semana caerán mis próximos cumpleaños?',
          a: 'La herramienta calcula y muestra una tabla detallada con el día de la semana correspondiente a tus próximos 5 cumpleaños anuales.',
        },
        {
          q: '¿Queda expuesta mi fecha de nacimiento al usar el contador?',
          a: 'No. El cálculo se ejecuta 100% en tu navegador y no se envía ninguna fecha a redes externas ni servidores.',
        },
      ],
    },
    pt: {
      title: 'Contagem Regressiva para o Próximo Aniversário',
      description: 'Contagem regressiva em tempo real de dias, horas, minutos e segundos até seu próximo aniversário. Veja os próximos dias da semana.',
      heading: 'Contagem Regressiva para o Aniversário',
      subheading: 'Relógio em tempo real calculando dias, horas, minutos e segundos até sua próxima celebração, com tabela de dias da semana futuros.',
      sections: [
        {
          title: 'Quanto Tempo Falta para Meu Aniversário?',
          paragraphs: [
            'O aniversário celebra o ciclo astronômico em que a Terra conclui uma translação solar em relação à sua data natalícia. Nosso contador em tempo real acompanha essa contagem regressiva segundo a segundo.',
            'O sistema foi programado para poupar a bateria do seu smartphone: ao minimizar a página ou trocar de aplicativo, o contador pausa a animação e resincroniza imediatamente ao retornar.',
          ],
        },
        {
          title: 'Por Que o Dia da Semana do Aniversário Muda?',
          paragraphs: [
            'O ano padrão possui 365 dias, o que corresponde a 52 semanas e sobra 1 dia. Por isso, a cada ano comum seu aniversário avança exatamente um dia da semana (de segunda para terça, por exemplo).',
            'Quando o ciclo atravessa um ano bissexto (com 366 dias), sobram 2 dias na divisão semanal, fazendo a comemoração pular dois dias na semana (de quarta diretamente para sexta-feira).',
          ],
        },
        {
          title: 'Idades Marcantes e Efeitos Legais no Brasil',
          paragraphs: [
            'Várias idades determinam novos direitos e responsabilidades civis:',
          ],
          cards: [
            {
              title: '18 Anos (Maioridade Civil)',
              desc: 'Plena capacidade civil, permissão para habilitação (CNH), alistamento militar obrigatório masculino e voto facultativo que se torna obrigatório.',
            },
            {
              title: '21 Anos (Marcos Profissionais)',
              desc: 'Idade mínima para determinados cargos públicos, concursos específicos de segurança pública e categorias profissionais de transporte.',
            },
            {
              title: 'Aposentadoria e Terceira Idade',
              desc: 'Marcos previdenciários junto ao INSS (conforme regras de transição da EC 103/2019) e direitos prioritários pelo Estatuto da Pessoa Idosa.',
            },
          ],
        },
      ],
      faqs: [
        {
          q: 'Quantos dias faltam para o meu aniversário?',
          a: 'Digite o dia e mês de nascimento e a calculadora exibirá instantaneamente a contagem regressiva ao vivo em dias, horas, minutos e segundos.',
        },
        {
          q: 'Como funciona a contagem para quem nasceu em 29 de fevereiro?',
          a: 'Em anos não bissextos, a contagem mira no dia 28 de fevereiro (convenção civil predominante). Em anos bissextos (como 2028), mira no dia 29.',
        },
        {
          q: 'O contador descarrega a bateria do celular?',
          a: 'Não. Ele utiliza a Page Visibility API para suspender as atualizações de segundo quando você não estiver olhando para a tela.',
        },
        {
          q: 'Como saber em que dia da semana cairá meu aniversário nos próximos anos?',
          a: 'A ferramenta lista a projeção dos seus próximos 5 aniversários, indicando o dia da semana exato de cada um.',
        },
        {
          q: 'Minha data de nascimento fica gravada no site?',
          a: 'Não. Os dados são processados apenas na memória do seu navegador e descartados assim que a página é fechada.',
        },
      ],
    },
  },
  'half-birthday': {
    es: {
      title: 'Calculadora de Medio Cumpleaños - Fecha 6 Meses',
      description: 'Calcula la fecha exacta de tu medio cumpleaños (6 meses desde tu nacimiento) y los días que faltan para celebrarlo con precisión.',
      heading: 'Calculadora de Medio Cumpleaños',
      subheading: 'Calcula la fecha exacta de tu medio cumpleaños a los 6 meses de tu nacimiento y cuántos días faltan para tu próxima celebración.',
      sections: [
        {
          title: '¿Qué es un Medio Cumpleaños y Cuándo se Celebra?',
          paragraphs: [
            'El medio cumpleaños se sitúa exactamente seis meses después (o antes) de tu fecha oficial de nacimiento. Representa el ecuador del año solar personal.',
            'Se ha convertido en una celebración muy extendida en colegios y familias para niños nacidos en los meses de verano o Navidad, permitiéndoles festejar con sus compañeros durante el curso escolar.',
          ],
        },
        {
          title: 'Ajuste de Fin de Mes en el Medio Cumpleaños',
          paragraphs: [
            'Sumar exactamente seis meses a ciertas fechas del calendario exige reglas de ajuste cuando los meses tienen distinta longitud:',
          ],
          cards: [
            {
              title: 'Nacidos a Final de Mes (Día 31)',
              desc: 'Si naciste el 31 de marzo, seis meses después es septiembre, que solo tiene 30 días. Tu medio cumpleaños se celebra el 30 de septiembre.',
            },
            {
              title: 'Nacidos a Final de Agosto',
              desc: 'Seis meses después de agosto es febrero. Los nacidos el 29, 30 o 31 de agosto celebran su medio cumpleaños el 28 de febrero (o 29 en bisiestos).',
            },
            {
              title: 'Hitos en Bebés y Desarrollo Infantil',
              desc: 'En pediatría, los hitos de desarrollo motor, alimentación complementaria y pautas de vacunación se miden a los 6 y 18 meses.',
            },
          ],
        },
        {
          title: 'Mitad de Camino Hacia la Nueva Década',
          paragraphs: [
            'Cumplir 29 y medio, 39 y medio o 49 y medio se ha convertido en una divertida ocasión para reunirse con amigos antes de cambiar de década.',
            'Nuestra herramienta te indica cuántos días exactos quedan para tu próximo medio cumpleaños con cuenta regresiva en vivo.',
          ],
        },
      ],
      faqs: [
        {
          q: '¿Qué es el medio cumpleaños?',
          a: 'Es la fecha que cae exactamente a seis meses de distancia de tu cumpleaños oficial (por ejemplo, del 15 de enero al 15 de julio).',
        },
        {
          q: '¿Qué ocurre si la fecha de seis meses no existe en el calendario?',
          a: 'Se aplica la regla de ajuste al último día del mes correspondiente. Si naciste el 31 de octubre, tu medio cumpleaños es el 30 de abril.',
        },
        {
          q: '¿Por qué se celebra el medio cumpleaños en los colegios?',
          a: 'Permite a los alumnos con cumpleaños en vacaciones de verano (julio y agosto) tener su fiesta con profesores y amigos en clase.',
        },
        {
          q: '¿Cuántos días hay exactamente en medio año?',
          a: 'Según los meses que abarque y si incluye febrero bisiesto, medio año comprende entre 181 y 184 días naturales.',
        },
        {
          q: '¿Se transmiten mis datos personales?',
          a: 'No. El cálculo es completamente local en tu navegador y respeta íntegramente tu privacidad.',
        },
      ],
    },
    pt: {
      title: 'Calculadora de Meio Aniversário - 6 Meses de Vida',
      description: 'Calcule a data exata do seu meio aniversário (6 meses a partir da data de nascimento) e veja quantos dias faltam para comemorar.',
      heading: 'Calculadora de Meio Aniversário',
      subheading: 'Encontre a data exata do seu meio aniversário (6 meses a partir do nascimento) e veja quantos dias faltam para essa data especial.',
      sections: [
        {
          title: 'O que é o Meio Aniversário e Por Que Celebrar?',
          paragraphs: [
            'O meio aniversário ocorre exatamente seis meses após (ou antes) do seu aniversário oficial. É o ponto médio da órbita solar pessoal.',
            'Tornou-se uma tradição popular no ambiente escolar e familiar para crianças nascidas nos meses de férias de verão (dezembro e janeiro), possibilitando comemorar junto aos colegas de turma no meio do ano letivo.',
          ],
        },
        {
          title: 'Regras de Ajuste de Calendário para os 6 Meses',
          paragraphs: [
            'Adicionar seis meses a uma data requer ajuste automático para meses com menos dias:',
          ],
          cards: [
            {
              title: 'Nascidos no Dia 31',
              desc: 'Para quem nasceu em 31 de março, seis meses depois cai em setembro, que tem 30 dias. O meio aniversário é no dia 30 de setembro.',
            },
            {
              title: 'Nascidos no Fim de Agosto',
              desc: 'Seis meses após agosto é fevereiro. Quem nasceu em 29, 30 ou 31 de agosto comemora o meio aniversário em 28 de fevereiro (ou 29 no bissexto).',
            },
            {
              title: 'Acompanhamento Pediátrico do Bebê',
              desc: 'Na pediatria, marcos fundamentais de introdução alimentar e saltos de desenvolvimento ocorrem exatamente aos 6 e 18 meses.',
            },
          ],
        },
        {
          title: 'Metade do Caminho para a Próxima Década',
          paragraphs: [
            'Comemorar os 29,5 ou 39,5 anos é uma oportunidade descontraída de confraternização antes da virada de década.',
            'Nossa calculadora indica a data precisa e a contagem de dias restantes para o próximo meio aniversário.',
          ],
        },
      ],
      faqs: [
        {
          q: 'O que é o meio aniversário?',
          a: 'É a data que fica exatamente a 6 meses de distância do seu aniversário oficial (por exemplo, 20 de março e 20 de setembro).',
        },
        {
          q: 'E se o dia de 6 meses depois não existir no calendário?',
          a: 'A data é ajustada para o último dia válido do mês de destino (como 30 de abril ou 28 de fevereiro).',
        },
        {
          q: 'Por que comemorar meio aniversário em escolas?',
          a: 'Ajuda crianças que fazem aniversário em período de férias escolares a receberem os parabéns e celebrarem com seus colegas de sala.',
        },
        {
          q: 'Quantos dias compõem exatamente meio ano?',
          a: 'Dependendo do semestre do ano e de anos bissextos, meio ano varia entre 181 e 184 dias corridos.',
        },
        {
          q: 'Minha data fica salva no sistema?',
          a: 'Não. O processamento é 100% no seu navegador sem armazenamento de cookies ou envio a servidores.',
        },
      ],
    },
  },
  'pet-age': {
    es: {
      title: 'Calculadora de Edad de Perros y Gatos en Años Humanos',
      description: 'Convierte la edad de tu perro o gato a años humanos según pautas veterinarias oficiales (AAHA/AVMA) por tamaño, peso y etapa de vida.',
      heading: 'Calculadora de Edad de Mascotas en Años Humanos',
      subheading: 'Calcula la edad real equivalente de tu perro o gato en años humanos según las directrices científicas veterinarias (AAHA y AVMA).',
      sections: [
        {
          title: 'La Ciencia Veterinaria frente al Mito de Multiplicar por 7',
          paragraphs: [
            'Durante décadas se repitió la creencia popular de que "un año de perro equivale a siete años humanos". La medicina veterinaria moderna (AAHA y AVMA) ha demostrado que el desarrollo de perros y gatos es completamente no lineal.',
            'Un perro o un gato experimenta una maduración biológica acelerada en sus dos primeros años de vida: al cumplir 1 año ya equivale a un adolescente humano de unos 15 años, y a los 2 años equivale aproximadamente a un adulto joven de 24 años.',
          ],
        },
        {
          title: 'Envejecimiento Canino según el Tamaño y Peso',
          paragraphs: [
            'El tamaño de la raza influye radicalmente en la velocidad de envejecimiento celular en perros:',
          ],
          cards: [
            {
              title: 'Razas Pequeñas (< 10 kg)',
              desc: 'Chihuahuas, Caniches Toy. Maduran rápido pero envejecen a solo 4 años humanos por año. Esperanza de vida de 15 a 18 años.',
            },
            {
              title: 'Razas Medianas (10 a 23 kg)',
              desc: 'Beagles, Cocker Spaniel. Envejecen a un ritmo de unos 5 años humanos anuales tras su madurez.',
            },
            {
              title: 'Razas Grandes (24 a 41 kg)',
              desc: 'Labradores, Pastores Alemanes. Envejecen a unos 6 años humanos anuales y alcanzan la etapa senior a los 7 años.',
            },
            {
              title: 'Razas Gigantes (> 41 kg)',
              desc: 'Gran Danés, Mastín. Envejecen a 7 u 8 años humanos por año calendario. Llegan a etapa geriátrica a los 5 o 6 años.',
            },
          ],
        },
        {
          title: 'Etapas de Vida en los Gatos (Guías AAHA/AAFP)',
          paragraphs: [
            'A diferencia de los perros, los felinos domésticos presentan una estructura corporal uniforme. Tras los 2 primeros años (24 años humanos), cada año natural equivale a unos 4 años humanos adicionales.',
            'Un gato entra en etapa madura a partir de los 7 años y en etapa senior/geriátrica a partir de los 11 años, requiriendo revisiones veterinarias periódicas de función renal y dental.',
          ],
        },
      ],
      faqs: [
        {
          q: '¿Por qué no es válida la regla de multiplicar por 7?',
          a: 'Porque el desarrollo animal no es lineal. Los animales maduran rápidamente en su primer año (alcanzando fertilidad y dentición adulta) y luego ralentizan su tasa de envejecimiento.',
        },
        {
          q: '¿Por qué los perros gigantes viven menos que los perros pequeños?',
          a: 'Los perros gigantes crecen a un ritmo celular extremadamente veloz en su etapa juvenil, lo que se asocia con un mayor estrés oxidativo y envejecimiento fisiológico temprano.',
        },
        {
          q: '¿A qué edad se considera senior a un perro o gato?',
          a: 'Los gatos y perros pequeños se consideran senior alrededor de los 7 u 8 años. Los perros grandes o gigantes alcanzan esta etapa a los 5 o 6 años.',
        },
        {
          q: '¿Cómo ayuda conocer la edad biológica de mi mascota?',
          a: 'Permite adaptar la alimentación (piensos senior), anticipar chequeos articulares de artrosis y realizar analíticas preventivas de riñón e hígado con el veterinario.',
        },
        {
          q: '¿Se recopilan datos sobre mi mascota?',
          a: 'No. El cálculo se efectúa estrictamente en el navegador sin guardar registros ni enviar datos a internet.',
        },
      ],
    },
    pt: {
      title: 'Calculadora de Idade de Cães e Gatos em Anos Humanos',
      description: 'Converta a idade do seu cão ou gato em anos humanos segundo diretrizes veterinárias oficiais (AAHA/AVMA) por porte e peso corporal.',
      heading: 'Calculadora de Idade de Pets em Anos Humanos',
      subheading: 'Converta a idade do seu cachorro ou gato em anos humanos com base em critérios científicos veterinários oficiais (AAHA e AVMA).',
      sections: [
        {
          title: 'Critérios Veterinários Oficiais vs. O Mito do 7 para 1',
          paragraphs: [
            'A famosa crença de que cada ano de cachorro equivale a sete anos humanos foi criada como uma regra empírica simplória. Pesquisas da American Animal Hospital Association (AAHA) e da AVMA comprovam que o envelhecimento pet é biológico e não-linear.',
            'Cães e gatos passam por um desenvolvimento acelerado nos dois primeiros anos: com 1 ano atingem a adolescência (cerca de 15 anos humanos) e aos 2 anos chegam à idade adulta jovem (aprox. 24 anos humanos).',
          ],
        },
        {
          title: 'Envelhecimento Canino por Porte e Peso',
          paragraphs: [
            'O porte da raça é o fator determinante na longevidade e no ritmo de desgaste celular canino:',
          ],
          cards: [
            {
              title: 'Porte Pequeno (< 10 kg)',
              desc: 'Pinscher, Poodle Toy, Shih Tzu. Envelhecem cerca de 4 anos humanos a cada ano após a fase jovem. Expectativa de 15 a 18 anos.',
            },
            {
              title: 'Porte Médio (10 a 23 kg)',
              desc: 'Beagle, Cocker, Buldogue Francês. Envelhecem aproximadamente 5 anos humanos por ano civil.',
            },
            {
              title: 'Porte Grande (24 a 41 kg)',
              desc: 'Labrador, Golden Retriever, Pastor Alemão. Envelhecem cerca de 6 anos humanos anualmente. São idosos a partir dos 7 anos.',
            },
            {
              title: 'Porte Gigante (> 41 kg)',
              desc: 'Dogue Alemão, São Bernardo. Envelhecem entre 7 e 8 anos humanos por ano. Entram na terceira idade aos 5 ou 6 anos.',
            },
          ],
        },
        {
          title: 'Fases da Vida dos Gatos (Diretrizes AAHA/AAFP)',
          paragraphs: [
            'Como os felinos domésticos têm conformação física semelhante, seguem um padrão uniforme: após os 2 primeiros anos (24 anos humanos), cada ano adiciona em média 4 anos equivalentes.',
            'Um felino é considerado sênior aos 11 anos e geriátrico a partir dos 15 anos, necessitando de cuidados redobrados com função renal e saúde dental.',
          ],
        },
      ],
      faqs: [
        {
          q: 'Por que a regra de multiplicar por 7 está errada?',
          a: 'Porque o amadurecimento físico de cães e gatos ocorre em ritmo explosivo no início da vida, estabilizando-se em ritmos diferentes conforme o porte na fase adulta.',
        },
        {
          q: 'Por que cães de grande porte vivem menos que os pequenos?',
          a: 'Cães gigantes crescem muito rápido da fase de filhote para a fase adulta, o que acelera a senescência celular e eleva a propensão a problemas cardíacos e articulares.',
        },
        {
          q: 'Quando um pet passa a ser considerado idoso (sênior)?',
          a: 'Cães pequenos e gatos por volta dos 7 a 8 anos. Cães de grande porte e gigantes por volta dos 5 a 6 anos de vida.',
        },
        {
          q: 'Por que é importante converter a idade do pet em anos humanos?',
          a: 'Facilita a compreensão dos tutores sobre a necessidade de check-ups preventivos, exames de sangue periódicos e mudança na dieta para rações sênior.',
        },
        {
          q: 'Os dados do meu pet ficam gravados no site?',
          a: 'Não. Todas as conversões são feitas exclusivamente no seu navegador com total privacidade.',
        },
      ],
    },
  },
};

