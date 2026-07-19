import { GraduationCap, Wrench, Coins, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

const programs = [
  {
    icon: GraduationCap,
    title: "Training",
    description:
      "Comprehensive entrepreneurship, business management, and skills training for aspiring and established business owners.",
  },
  {
    icon: Wrench,
    title: "Technical Assistance",
    description:
      "Hands-on mentorship and expert guidance to help entrepreneurs overcome operational and strategic challenges.",
  },
  {
    icon: Coins,
    title: "Financing",
    description:
      "Access to micro-loans, grants, and investor connections to fuel business growth and sustainability.",
  },
  {
    icon: Network,
    title: "Networking",
    description:
      "Build meaningful connections with peers, mentors, partners, and opportunities across Madagascar and beyond.",
  },
];

export function Programs() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text sm:text-4xl">
            Our Programs
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Four pillars of support designed to nurture entrepreneurship at every
            stage.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <Card key={program.title}>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-text">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    {program.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink href="/programs" variant="outline">
            Learn More About Our Programs
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
