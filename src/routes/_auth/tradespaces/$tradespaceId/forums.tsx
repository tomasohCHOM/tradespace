import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/tradespaces/$tradespaceId/forums")({
  component: () => <div className="p-6">Forums</div>,
});
