import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getFichesByCategory } from "@/lib/fiches";

export function FichesCategorie({
  category,
  titre,
}: {
  category: string;
  titre: string;
}) {
  const fiches = getFichesByCategory(category);
  if (fiches.length === 0) return null;

  return (
    <section className="bg-[#F4F2EC] py-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 text-center">
            {titre}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {fiches.map((f) => (
              <Link
                key={f.slug}
                href={`/fiches/${f.slug}`}
                className="group bg-white p-4 rounded-lg hover:shadow-lg transition-all flex items-start gap-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.image || `/images/fiches/${f.slug}.jpg`}
                  alt={f.title}
                  className="w-20 h-20 object-cover rounded-md shrink-0 bg-[#F4F2EC]"
                />
                <div>
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-1 group-hover:text-[#362A24] transition-colors">
                    {f.title} &rarr;
                  </h3>
                  <p className="text-gray-500 text-sm text-justify">
                    {f.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
