import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-display font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link to="/mentors">
            <Button variant="outline" size="lg">
              Find Mentors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
