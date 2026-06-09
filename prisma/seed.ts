import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const password = await bcrypt.hash("password123", 10);

  // ─── STUDENTS ───
  const student1 = await prisma.user.upsert({
    where: { email: "lucia.garcia@example.com" },
    update: {},
    create: {
      name: "Lucía García",
      email: "lucia.garcia@example.com",
      password,
      role: "STUDENT",
      bio: "Diseñadora gráfica especializada en branding. Apasionada por la tipografía y la identidad visual.",
      studentProfile: {
        create: {
          skills: ["Branding", "Graphic Design", "Typography"],
          interests: "Diseño de identidad corporativa, packaging, diseño editorial",
          course: "4º Diseño Gráfico",
          linkedin: "https://linkedin.com/in/luciagarcia",
        },
      },
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "marc.lopez@example.com" },
    update: {},
    create: {
      name: "Marc López",
      email: "marc.lopez@example.com",
      password,
      role: "STUDENT",
      bio: "Diseñador UX/UI con enfoque en producto digital. Me encanta crear interfaces intuitivas y accesibles.",
      studentProfile: {
        create: {
          skills: ["UX Design", "UI Design", "Prototyping", "Figma"],
          interests: "Diseño de producto digital, accesibilidad, design systems",
          course: "3º Diseño Digital",
          linkedin: "https://linkedin.com/in/marclopez",
          website: "https://marclopez.design",
        },
      },
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "ana.martinez@example.com" },
    update: {},
    create: {
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      password,
      role: "STUDENT",
      bio: "Diseñadora de producto e ilustradora. Busco proyectos donde combinar creatividad y funcionalidad.",
      studentProfile: {
        create: {
          skills: ["Product Design", "Illustration", "Branding", "Packaging"],
          interests: "Diseño sostenible, ilustración aplicada, packaging eco-friendly",
          course: "5º Diseño de Producto",
        },
      },
    },
  });

  console.log("✅ Students created");

  // ─── COMPANIES ───
  const companyUser1 = await prisma.user.upsert({
    where: { email: "info@estudiocreativo.com" },
    update: {},
    create: {
      name: "Estudio Creativo SL",
      email: "info@estudiocreativo.com",
      password,
      role: "COMPANY",
      bio: "Estudio de diseño con 10 años de experiencia en branding y comunicación visual.",
    },
  });

  const company1 = await prisma.company.upsert({
    where: { email: "info@estudiocreativo.com" },
    update: {},
    create: {
      name: "Estudio Creativo SL",
      email: "info@estudiocreativo.com",
      password,
      description:
        "Estudio de diseño boutique especializado en branding, identidad corporativa y diseño editorial.",
      website: "https://estudiocreativo.com",
      sector: "Diseño & Branding",
      location: "Barcelona",
      isVerified: true,
    },
  });

  const companyUser2 = await prisma.user.upsert({
    where: { email: "hola@techinnova.com" },
    update: {},
    create: {
      name: "TechInnova",
      email: "hola@techinnova.com",
      password,
      role: "COMPANY",
      bio: "Startup de tecnología educativa buscando talento en diseño UX/UI.",
    },
  });

  const company2 = await prisma.company.upsert({
    where: { email: "hola@techinnova.com" },
    update: {},
    create: {
      name: "TechInnova",
      email: "hola@techinnova.com",
      password,
      description:
        "Startup EdTech que desarrolla plataformas de aprendizaje adaptativo. Buscamos diseñadores con visión para crear experiencias educativas innovadoras.",
      website: "https://techinnova.io",
      sector: "Tecnología Educativa",
      location: "Madrid",
      isVerified: true,
    },
  });

  console.log("✅ Companies created");

  // ─── PROJECTS ───
  const project1 = await prisma.project.create({
    data: {
      userId: student1.id,
      title: "Identidad Visual — Café de Altura",
      description:
        "Proyecto de branding completo para una marca de café de especialidad. Incluye logotipo, paleta cromática, tipografía, packaging y aplicación en soportes digitales y físicos. La identidad se basa en los tonos tierra y la artesanía del producto.",
      tags: ["branding", "packaging", "identidad-corporativa"],
      category: "Academic",
      images: [],
      visible: true,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      userId: student2.id,
      title: "App — EcoTracker",
      description:
        "Diseño UX/UI de una aplicación móvil para tracking de huella de carbono personal. Investigación de usuarios, prototipado en Figma, test de usabilidad y diseño final. La app gamifica la reducción de emisiones para incentivar hábitos sostenibles.",
      tags: ["ux", "ui", "figma", "sostenibilidad"],
      category: "Personal",
      images: [],
      visible: true,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      userId: student3.id,
      title: "Packaging Sostenible — Oliva Eco",
      description:
        "Diseño de packaging sostenible para una línea de aceites de oliva ecológicos. Investigación de materiales biodegradables, diseño estructural y gráfico. El proyecto ganó el premio al mejor diseño de packaging sostenible 2025.",
      tags: ["packaging", "sostenible", "branding", "premio"],
      category: "Professional",
      images: [],
      visible: true,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      userId: student1.id,
      title: "Rediseño Web — Museo de Arte Contemporáneo",
      description:
        "Rediseño completo de la experiencia digital del Museo de Arte Contemporáneo de Barcelona. Investigación UX, arquitectura de información, diseño responsive y prototipo interactivo.",
      tags: ["ux", "web", "diseño-digital", "cultura"],
      category: "Academic",
      images: [],
      visible: true,
    },
  });

  console.log("✅ Projects created");

  // ─── FEEDBACK ───
  await prisma.feedback.createMany({
    data: [
      { projectId: project1.id, userId: student2.id, rating: 5, comment: "La paleta cromática es espectacular, muy bien trabajada la identidad." },
      { projectId: project1.id, userId: student3.id, rating: 4, comment: "Me encanta el enfoque artesanal. El packaging es una pasada." },
      { projectId: project2.id, userId: student1.id, rating: 5, comment: "Muy buen trabajo de investigación. La gamificación está muy bien integrada." },
      { projectId: project3.id, userId: student2.id, rating: 5, comment: "Proyecto inspirador. El enfoque sostenible es justo lo que necesita el sector." },
    ],
  });

  console.log("✅ Feedback created");

  // ─── FORUM POSTS ───
  const post1 = await prisma.forumPost.create({
    data: {
      userId: student1.id,
      title: "¿Cómo enfocáis vuestro portfolio para buscar prácticas?",
      content:
        "Estoy empezando a preparar mi portfolio para solicitar prácticas en estudios de diseño. Me gustaría saber cómo lo enfocáis: ¿mostráis proyectos académicos aunque no sean perfectos? ¿Qué creéis que valoran más las empresas? Agradezco cualquier consejo.",
      category: "Discussion",
    },
  });

  const post2 = await prisma.forumPost.create({
    data: {
      userId: student2.id,
      title: "Recomendaciones de recursos para aprender Design Systems",
      content:
        "Llevo un tiempo interesado en design systems y quería saber qué recursos recomendáis. He visto algunos cursos de Figma pero no sé cuáles merecen la pena. También busco ejemplos de design systems open-source para estudiar su estructura.",
      category: "Resources",
    },
  });

  const post3 = await prisma.forumPost.create({
    data: {
      userId: companyUser1.id,
      title: "Buscamos estudiante en prácticas para nuestro estudio de branding",
      content:
        "En Estudio Creativo SL estamos buscando un estudiante de diseño gráfico para incorporarse en prácticas. Valoramos portafolio con proyectos de branding, manejo de Adobe Suite y ganas de aprender. Interesados, enviad vuestro portfolio a info@estudiocreativo.com.",
      category: "Discussion",
      pinned: true,
    },
  });

  console.log("✅ Forum posts created");

  // ─── COMMENTS ───
  await prisma.forumComment.createMany({
    data: [
      { postId: post1.id, userId: student2.id, content: "Yo creo que es mejor mostrar 3-4 proyectos bien trabajados que muchos proyectos mediocres. Calidad sobre cantidad. Y sí, incluye proyectos académicos pero explícalos bien: cuál fue tu rol, qué aprendiste." },
      { postId: post1.id, userId: student3.id, content: "Totalmente de acuerdo. Añade también proyectos personales aunque no sean encargos reales. Muestran iniciativa y pasión por lo que haces." },
      { postId: post2.id, userId: student1.id, content: "Te recomiendo el curso de Design Systems de Figma en YouTube, es gratuito y muy completo. También el sistema de Shadcn/ui está muy bien documentado para empezar." },
      { postId: post2.id, userId: student3.id, content: "Echa un ojo a Material Design 3 y a la documentación de Spectrum (Adobe). Son ejemplos muy completos de design systems a gran escala." },
    ],
  });

  console.log("✅ Comments created");

  // ─── COMPANY NEEDS ───
  const need1 = await prisma.companyNeed.create({
    data: {
      companyId: company1.id,
      title: "Diseñador/a gráfico para proyecto de rebranding",
      description:
        "Buscamos un estudiante o recién titulado para colaborar en un proyecto de rebranding de una cadena de hostelería. El proyecto incluye diseño de logotipo, packaging y aplicaciones digitales.",
      skills: ["Branding", "Packaging", "Adobe Illustrator"],
      status: "open",
    },
  });

  const need2 = await prisma.companyNeed.create({
    data: {
      companyId: company2.id,
      title: "Prácticas UX/UI para plataforma educativa",
      description:
        "Buscamos un diseñador UX/UI para realizar prácticas en nuestro equipo de producto. Trabajarás en el diseño de features para nuestra plataforma de aprendizaje adaptativo. Imprescindible manejo de Figma.",
      skills: ["UX Design", "UI Design", "Figma", "Design Systems"],
      status: "open",
    },
  });

  const need3 = await prisma.companyNeed.create({
    data: {
      companyId: company1.id,
      title: "Ilustrador/a para campaña de comunicación",
      description:
        "Necesitamos un ilustrador para crear una serie de ilustraciones personalizadas para la campaña de comunicación anual de uno de nuestros clientes del sector alimentario.",
      skills: ["Ilustración", "Adobe Illustrator", "Creatividad"],
      status: "open",
    },
  });

  console.log("✅ Company needs created");

  // ─── PROPOSALS ───
  await prisma.proposal.create({
    data: {
      userId: student3.id,
      title: "Taller: Packaging Sostenible",
      description:
        "Propongo organizar un taller práctico sobre diseño de packaging sostenible. Exploraríamos materiales alternativos, técnicas de prototipado rápido y cómo comunicar la sostenibilidad a través del diseño.",
      category: "Event",
      tags: ["taller", "sostenibilidad", "packaging"],
      status: "open",
    },
  });

  await prisma.proposal.create({
    data: {
      userId: student2.id,
      title: "Colaboración: Design System para la asociación",
      description:
        "Propongo crear un design system colaborativo para la asociación de diseño. Serviría como proyecto real para quienes quieran aprender sobre design systems mientras creamos una herramienta útil para todos.",
      category: "Collaboration",
      tags: ["design-system", "colaboración", "figma"],
      status: "open",
    },
  });

  await prisma.proposal.create({
    data: {
      userId: student1.id,
      title: "Identidad visual para ONG local",
      description:
        "Busco estudiantes de diseño para colaborar en un proyecto real: crear la identidad visual de una ONG local que trabaja con jóvenes en riesgo de exclusión. Proyecto sin ánimo de lucro con impacto real.",
      category: "Project Idea",
      tags: ["branding", "ONG", "impacto-social"],
      status: "open",
    },
  });

  console.log("✅ Proposals created");
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
