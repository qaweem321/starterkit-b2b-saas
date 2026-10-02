import Link from "next/link";

const features = [
  {
    title: "Organizations",
    description: "Every customer gets their own workspace. Data never leaks between teams.",
  },
  {
    title: "Roles & permissions",
    description: "Owners, admins and members each see exactly what they should.",
  },
  {
    title: "Subscription billing",
    description: "Charge each organization monthly with Stripe, built in from day one.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200">
        <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">
            Starter<span className="text-blue-600">Kit</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            The fastest way to launch your B2B SaaS
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Teams, roles, and billing are already done. You build the part that makes your
            product unique.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Start free
            </Link>
            <a
              href="#features"
              className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              Learn more
            </a>
          </div>
        </section>

        <section id="features" className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl px-6 grid gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StarterKit
      </footer>
    </div>
  );
}
