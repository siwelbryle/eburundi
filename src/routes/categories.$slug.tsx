import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { getCategory, PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  component: CategoryPage,
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.category.name} · EBM` : "Category" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto max-w-xl flex-1 p-12 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Button asChild className="mt-4"><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>All products</Link></Button>
      </div>
      <SiteFooter />
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const products = PRODUCTS.filter((p) => p.categorySlug === category.slug);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-4xl">{category.emoji}</span>
          <div>
            <h1 className="text-3xl font-extrabold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">{products.length} products</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
