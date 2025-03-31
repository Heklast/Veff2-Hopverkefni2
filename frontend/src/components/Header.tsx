import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories in Header:", error);
    return [];
  }
}

export default async function Header() {
  const categories = await getCategories();

  return (
    <header className="bg-white shadow-md border-b py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-xl font-semibold hover:underline">
          <h1>Heimasíða Heklu og Óla</h1>
        </Link>
        <nav className="headerNav flex flex-wrap gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.id}`}>
              {cat.name}
            </Link>
          ))}
          {/* Add login/signup links */}
          <Link href="/login" className="hover:underline">
            Login
          </Link>
          <Link href="/signup" className="hover:underline">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
