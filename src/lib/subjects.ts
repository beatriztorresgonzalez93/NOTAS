export const FIXED_SUBJECTS = [
  { slug: "documentacion-tecnica", name: "Documentación técnica", order: 0 },
  { slug: "informatica-industrial", name: "Informática industrial", order: 1 },
  {
    slug: "sistemas-medida-regulacion",
    name: "Sistemas de medida y regulación",
    order: 2,
  },
  { slug: "sistemas-potencia", name: "Sistemas de potencia", order: 3 },
  { slug: "sistemas-electricos", name: "Sistemas eléctricos", order: 4 },
  {
    slug: "neumaticos-hidraulicos",
    name: "Neumáticos e hidráulicos",
    order: 5,
  },
  {
    slug: "sistemas-secuenciales",
    name: "Sistemas secuenciales programables",
    order: 6,
  },
  {
    slug: "itinerario-empleabilidad",
    name: "Itinerario para la empleabilidad I",
    order: 7,
  },
  { slug: "ingles-negocios", name: "Inglés para los negocios", order: 8 },
] as const;

export const TASK_COUNT = 9;

export const EMPTY_TASKS: (number | null)[] = Array(TASK_COUNT).fill(null);

export type FixedSubjectSlug = (typeof FIXED_SUBJECTS)[number]["slug"];
