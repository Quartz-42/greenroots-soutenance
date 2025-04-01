import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative bg-[url(/bg_1.png)] bg-no-repeat bg-cover bg-center py-16 md:py-24">
      {/* Overlay pour assurer la lisibilité du texte */}
      <div className="absolute inset-0 bg-white/90"></div>

      {/* Contenu */}
      <div className="relative grid max-w-screen-xl px-4 mx-auto lg:gap-12 xl:gap-4 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7 space-y-8 md:space-y-12">
          <div className="space-y-4">
            <h2 className="font-['Archive'] text-3xl font-bold text-green-700">GREENROOTS</h2>
            <p className="font-['Archive'] text-xl text-black">Ensemble, replantons l'avenir !</p>
          </div>
          <p className="text-gray-600 md:text-lg lg:text-xl">Chez GreenRoots, chaque arbre vendu contribue à un monde plus vert.</p>
          <div className="space-y-4">
            <p className="text-gray-600 md:text-lg lg:text-xl">
              Nous reversons une partie de nos bénéfices à des associations engagées dans la reforestation, car agir pour la planète, c'est notre mission.
            </p>
            <p className="text-gray-600 md:text-lg lg:text-xl">
              Pas de promesses, que du concret : des forêts renaissent grâce à vous. 🌱💚
            </p>
          </div>
        </div>
        <div className="mt-4 lg:mt-0 lg:col-span-5 lg:flex items-center">
          <Image
            src="/mockups.png"
            alt="Reforestation en montagne"
            width={600}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>

      </div>
    </section>

  )
} 