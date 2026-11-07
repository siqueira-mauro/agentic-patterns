type Villain = {
    alias: string;
    power: string;
    /** Única especialidad capaz de neutralizarlo. */
    counteredBy: string;
    /** 1 = máxima prioridad. */
    threat: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    /**
     * Puede liberar a los demás. NO se muestra en el texto del escenario:
     * el modelo debe deducirlo a partir del poder descrito.
     */
    freesOthers: boolean;
};

type Hero = {
    alias: string;
    specialty: string;
    /** Horas que puede operar antes de quedar fuera de combate. */
    availableHours: number;
};

const VILLAINS: Villain[] = [
    {
        alias: 'Mister Freeze',
        power: 'congela todo a su alrededor',
        counteredBy: 'fuego',
        threat: 1,
        freesOthers: false,
    },
    {
        alias: 'Killgrave',
        power: 'controla mentes con la voz',
        counteredBy: 'tecnología',
        threat: 2,
        freesOthers: false,
    },
    {
        alias: 'The Shade',
        power: 'se vuelve intangible en las sombras',
        counteredBy: 'luz',
        threat: 7,
        freesOthers: false,
    },
    {
        // esse cara pode complicar bastante as coisas!
        alias: 'Mirror Master',
        power: 'viaja por la dimensión espejo y puede sacar a otros de sus celdas',
        counteredBy: 'tecnología',
        threat: 3,
        freesOthers: true,
    },
    {
        alias: 'Solomon Grundy',
        power: 'regenera su cuerpo sin importar el daño recibido',
        counteredBy: 'luz',
        threat: 6,
        freesOthers: false,
    },
    {
        alias: 'Doctor Light',
        power: 'absorbe y redirige cualquier fuente de energía luminosa',
        counteredBy: 'luz',
        threat: 4,
        freesOthers: false,
    },
    {
        alias: 'Juggernaut',
        power: 'fuerza imparable, nada detiene su avance',
        counteredBy: 'telequinesis',
        threat: 5,
        freesOthers: false,
    },
];

const HEROES: Hero[] = [
    // se comentar qualquer herói, deve falhar:
    { alias: 'Antorcha Humana', specialty: 'fuego', availableHours: 6 },
    { alias: 'Green Lantern', specialty: 'luz', availableHours: 4 },
    { alias: 'Iron Man', specialty: 'tecnología', availableHours: 5 },
    { alias: 'Jean Grey', specialty: 'telequinesis', availableHours: 3 },
    { alias: 'Superman', specialty: 'fuego|luz', availableHours: 2 },
];

export const SCENARIO_AS_TEXT = [
    'VILLANOS SUELTOS:',
    ...VILLAINS.map(
        (villain) =>
            `  ${villain.alias} | poder: ${villain.power} | ` +
            `solo lo detiene: ${villain.counteredBy} | amenaza: ${villain.threat}/7`,
    ),
    '',
    'HÉROES DISPONIBLES:',
    ...HEROES.map(
        (hero) =>
            `  ${hero.alias} | especialidad: ${hero.specialty} | ` +
            `horas disponibles: ${hero.availableHours}`,
    ),
].join('\n');

/**
 * VILLANOS SUELTOS:
 *   Mister Freeze | poder: congela todo a su alrededor | solo lo detiene: fuego | amenaza: 1/7
 *   Killgrave | poder: controla mentes con la voz | solo lo detiene: tecnología | amenaza: 2/7
 *   The Shade | poder: se vuelve intangible en las sombras | solo lo detiene: luz | amenaza: 7/7
 *   Mirror Master | poder: viaja por la dimensión espejo y puede sacar a otros de sus celdas | solo lo detiene: tecnología | amenaza: 3/7
 *   Solomon Grundy | poder: regenera su cuerpo sin importar el daño recibido | solo lo detiene: luz | amenaza: 6/7
 *   Doctor Light | poder: absorbe y redirige cualquier fuente de energía luminosa | solo lo detiene: luz | amenaza: 4/7
 *   Juggernaut | poder: fuerza imparable, nada detiene su avance | solo lo detiene: telequinesis | amenaza: 5/7
 *
 * HÉROES DISPONIBLES:
 *   Antorcha Humana | especialidad: fuego | horas disponibles: 6
 *   Green Lantern | especialidad: luz | horas disponibles: 4
 *   Iron Man | especialidad: tecnología | horas disponibles: 5
 *   Jean Grey | especialidad: telequinesis | horas disponibles: 3
 */


// ---------------------------------------------------------------------------
// A) SIN PLANIFICACIÓN — una sola llamada, todo de golpe
// ---------------------------------------------------------------------------
// TODO: 
async function withoutPlanning() {
    console.log('\n═══ A) SIN PLANIFICACIÓN ═══\n'.blue);

    console.log(
        (
            '\n  ⚠️  Verifica: ¿va Mirror Master primero?' +
            '\n      ¿cada héroe contrarresta de verdad el poder asignado?' +
            '\n      ¿son atrapados en orden de amenaza?' +
            '\n      ¿alguien supera sus horas disponibles?'
        ).yellow,
    );

}


// ---------------------------------------------------------------------------
// B) CON PLANIFICACIÓN — primero el plan, luego la ejecución
// ---------------------------------------------------------------------------
// TODO: 



// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
// TODO: 
export async function planningMain() {
    // const a = await withoutPlanning();
    // const b = await withPlanning();

    console.log('\n═══ COMPARATIVA ═══\n'.blue);
    console.table({
        // 'Sin planificación': a,
        // 'Con planificación': b,
    });


    console.log(
        '\n  Planificar cuesta más llamadas y más tokens.\n' +
        '  Lo que compra es que las restricciones sobrevivan hasta el final.\n' +
        '  Si no hay restricciones que perder, no compra nada.\n',
    );
}