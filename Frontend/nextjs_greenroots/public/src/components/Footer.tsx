import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className=" m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3">
            <Image src="/logo12.png" alt="Greenroots Logo" width={130} height={130} />
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <Link href="/about" className="hover:underline me-4 md:me-6">À propos</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline me-4 md:me-6">Politique de confidentialité</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline me-4 md:me-6">Conditions d'utilisation</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">
          © {new Date().getFullYear()} <Link href="/" className="hover:underline text-green-700">Greenroots™</Link>. Tous droits réservés.
        </span>
      </div>
    </footer>
  )
} 