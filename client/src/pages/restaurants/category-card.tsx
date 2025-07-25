import { Link } from "react-router"

interface CategoryCardProps {
  category: {
    id: string
    name: string
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/categoria/${category.id}`}
      className="flex flex-col items-center gap-2 min-w-24 pt-3 pb-1 hover:shadow-md transition-all rounded-md relative before:w-full before:h-1/2 before:bg-primary/50 before:top-0 before:absolute before:-z-10 overflow-hidden"
    >
      <img
        src="/hamburger.webp"
        alt={category.name}
        className="max-w-14"
      />

      <p className="bg-background text-sm text-muted-foreground font-semibold">
        {category.name}
      </p>
    </Link>
  )
}
