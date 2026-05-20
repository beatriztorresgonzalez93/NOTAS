import { EMPTY_TASKS, FIXED_SUBJECTS, TASK_COUNT } from "@/lib/subjects";
import { Subject } from "@/models/Subject";

const MERGED_ELECTRICOS_SLUG = "sistemas-electricos-neumaticos-hidraulicos";
const LEGACY_ELECTRICOS_SLUGS = [
  "sistemas-electricos",
  "neumaticos-hidraulicos",
] as const;

async function migrateLegacyElectricosSubjects() {
  const merged = await Subject.findOne({ slug: MERGED_ELECTRICOS_SLUG });
  const legacy = await Subject.find({
    slug: { $in: [...LEGACY_ELECTRICOS_SLUGS] },
  });

  if (!merged || legacy.length === 0) return;

  const mergedHasData =
    merged.tasks?.some((t: number | null) => t !== null) ||
    merged.exam != null ||
    merged.finalGrade != null;
  if (mergedHasData) return;

  const tasks: (number | null)[] = [...EMPTY_TASKS];
  let exam: number | null = null;
  let finalGrade: number | null = null;

  for (const old of legacy) {
    if (Array.isArray(old.tasks)) {
      old.tasks.forEach((value: number | null, index: number) => {
        if (
          index < TASK_COUNT &&
          value !== null &&
          value !== undefined &&
          tasks[index] === null
        ) {
          tasks[index] = value;
        }
      });
    }
    if (exam === null && old.exam != null) exam = old.exam;
    if (finalGrade === null && old.finalGrade != null) {
      finalGrade = old.finalGrade;
    }
  }

  await Subject.updateOne(
    { slug: MERGED_ELECTRICOS_SLUG },
    { $set: { tasks, exam, finalGrade } }
  );
}

export async function ensureFixedSubjects() {
  const slugs = FIXED_SUBJECTS.map((s) => s.slug);

  for (const item of FIXED_SUBJECTS) {
    await Subject.findOneAndUpdate(
      { slug: item.slug },
      {
        $setOnInsert: {
          slug: item.slug,
          tasks: [...EMPTY_TASKS],
          exam: null,
          finalGrade: null,
        },
        $set: { name: item.name, order: item.order },
      },
      { upsert: true }
    );
  }

  await migrateLegacyElectricosSubjects();

  await Subject.deleteMany({
    $or: [{ slug: { $exists: false } }, { slug: { $nin: slugs } }],
  });

  return Subject.find({ slug: { $in: slugs } }).sort({ order: 1 }).lean();
}
