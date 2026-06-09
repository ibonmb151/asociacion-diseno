import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { StudentSearch } from "./student-search";
import { Pagination } from "@/components/pagination";

const ITEMS_PER_PAGE = 12;

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

async function getStudents(
  search?: string,
  page = 1,
): Promise<[StudentProfile[], number]> {
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
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    });

    const total = await prisma.user.count({ where });

    return [users, total];
  } catch {
    return [[], 0];
  }
}

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const [students, total] = await getStudents(q, currentPage);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Editorial header */}
      <div className="page-header mb-2">
        <span className="page-header-eyebrow">Comunidad</span>
        <h1 className="font-heading text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Estudiantes
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
          Conoce a los diseñadores de Deusto. Explora perfiles, descubre 
          talento y encuentra compañeros para tu próximo proyecto.
        </p>
      </div>

      {/* Search bar */}
      <StudentSearch initialQuery={q ?? ""} />

      {/* Results count */}
      <p className="mb-6 text-sm text-muted">
        {total} {total === 1 ? "estudiante" : "estudiantes"}
      </p>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Link
            key={student.id}
            href={`/students/${student.id}`}
            className="listing-card group"
          >
            {/* Avatar */}
            <div className="flex justify-center">
              {student.image ? (
                <img
                  src={student.image}
                  alt={student.name ?? "Usuario"}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-light/50 text-xl font-bold text-accent">
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
            <div className="mt-4 text-center">
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
                  <span key={skill} className="rounded-full bg-accent-light/30 px-2.5 py-0.5 text-xs text-accent">
                    {skill}
                  </span>
                ))}
                {student.studentProfile.skills.length > 4 && (
                  <span className="text-xs text-muted">+{student.studentProfile.skills.length - 4}</span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/students"
        searchParams={{ q }}
      />
    </main>
  );
}
