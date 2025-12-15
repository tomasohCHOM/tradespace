import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/tradespaces/$tradespaceId/topics")({
  component: () => <div className="p-6">Topics</div>,
});
