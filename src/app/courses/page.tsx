import type { Metadata } from "next";
import type { Course } from "@/lib/admin/courses";
import { getCourses } from "@/lib/admin/courses";
import { DEMO_COURSE } from "@/lib/courses-fallback";
import CourseCard from "@/components/courses/CourseCard";
import CoursesMatrixBg from "@/components/courses/CoursesMatrixBg";

export const metadata: Metadata = {
  title: "Courses | Fangdu",
  description: "课程与社群产品",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses: Course[] = [];
  try {
    courses = await getCourses();
  } catch {
    courses = [];
  }
  if (courses.length === 0) {
    courses = [DEMO_COURSE];
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] py-16 px-6">
      <CoursesMatrixBg />
      <div className="relative z-0 mx-auto max-w-6xl">
        <h1 className="mb-12 text-center text-3xl font-bold text-foreground md:text-4xl">Courses</h1>
        <div className="flex flex-col gap-12 md:flex-row md:flex-wrap md:justify-center">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
