import { createFileRoute } from '@tanstack/react-router';

const ThreadPage: React.FC = () => {
  const { threadId } = Route.useParams();
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1>Thread {threadId}</h1>
      {/* Thread content here */}
    </div>
  );
};

export const Route = createFileRoute('/_auth/tradespaces/$tradespaceId/thread/$threadId')({
  component: ThreadPage,
});