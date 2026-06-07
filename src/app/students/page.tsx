import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { StudentSearch } from "./student-search";

interface StudentProfile {
  id: string;
  name: string | null;
  image: string | null;
  bio: string | null;
  studentProfile: {
    skills: string[];
    course: string | null;
  } | null;
}

async function getStudents(search?: string): Promise<StudentProfile[]> {
  try {
    const where: Record<string, unknown> = {
      role: "STUDENT",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { studentProfile: { skills: { hasSome: [search] } } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        studentProfile: {
          select: {
            skills: true,
            course: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return users;
  } catch {
    return [];
  }
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const students = await getStudents(q);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight text-fg">
          Directorio de Estudiantes
        </h1>
        <p className="mt-1 text-muted">
          Explora perfiles de estudiantes de diseño.
        </p>
      </div>

      {/* Search bar */}
      <StudentSearch initialQuery={q ?? ""} />

      {/* Results count */}
      <p className="mb-6 text-sm text-muted">
        {students.length === 0
          ? "No se encontraron estudiantes"
          : `${students.length} estudiante${students.length !== 1 ? "s" : ""} encontrado${students.length !== 1 ? "s" : ""}`}
      </p>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            className="group bento-card p-5"
          >
            {/* Avatar */}
            <div className="mb-4 flex justify-center">
              {student.image ? (
                <img
                  src={student.image}
                  alt={student.name ?? "Usuario"}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-2xl font-bold text-fg">
                  {student.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Name & Course */}
            <div className="text-center">
              <h3 className="font-heading text-lg font-medium text-fg">
                {student.name ?? "Usuario"}
              </h3>
              {student.studentProfile?.course && (
                <p className="mt-0.5 text-sm text-muted">
                  {student.studentProfile.course}
                </p>
              )}
            </div>

            {/* Bio */}
            {student.bio && (
              <p className="mt-2 line-clamp-2 text-center text-sm text-muted">
                {student.bio}
              </p>
            )}

            {/* Skills */}
            {student.studentProfile?.skills && student.studentProfile.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {student.studentProfile.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-muted"
                  >
                    {skill}
                  </span>
                ))}
                {student.studentProfile.skills.length > 4 && (
                  <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-muted">
                    +{student.studentProfile.skills.length - 4}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
