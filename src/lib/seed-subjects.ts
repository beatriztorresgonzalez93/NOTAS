import { EMPTY_TASKS, FIXED_SUBJECTS } from "@/lib/subjects";
import { Subject } from "@/models/Subject";

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

  await Subject.deleteMany({
    $or: [{ slug: { $exists: false } }, { slug: { $nin: slugs } }],
  });

  return Subject.find({ slug: { $in: slugs } }).sort({ order: 1 }).lean();
}
