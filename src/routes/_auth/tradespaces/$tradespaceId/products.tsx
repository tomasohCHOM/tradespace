import { createFileRoute } from "@tanstack/react-router";
import ProductsView from "@/components/products/ProductsView";

export const Route = createFileRoute("/_auth/tradespaces/$tradespaceId/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const { tradespaceId } = Route.useParams();
  return <ProductsView tradespaceId={tradespaceId} />;
}