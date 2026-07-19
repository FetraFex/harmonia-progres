import { Target, Users, HandHeart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

const missions = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower local entrepreneurs in Manakara through comprehensive support programs that build sustainable businesses and thriving communities.",
  },
  {
    icon: Users,
    title: "Our Vision",
    description:
      "A prosperous Manakara where every entrepreneur has the tools, knowledge, and network to succeed and contribute to regional development.",
  },
  {
    icon: HandHeart,
    title: "Our Values",
    description:
      "Integrity, collaboration, excellence, and a deep commitment to the people and potential of Madagascar's Fitovinany region.",
  },
];

export function Mission() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-text sm:text-4xl">
            Who We Are
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Harmonia Progres is dedicated to transforming local potential into
            lasting economic impact.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {missions.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text">{item.title}</h3>
                  <p className="mt-3 text-text-secondary">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
