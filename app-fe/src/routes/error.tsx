import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/error")({
  component: RouteComponent
});

function RouteComponent() {
  const { message } = Route.useSearch() as { message?: string };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4'>
      <div className='text-center'>
        <h1
          style={{
            marginBottom: "4px"
          }}
          className='text-9xl font-bold text-red-600 mb-4'
        >
          500
        </h1>
        <h2
          style={{
            marginBottom: "4px"
          }}
          className='text-3xl font-semibold text-gray-800 mb-10'
        >
          Internal Server Error
        </h2>
        <p className='text-lg text-gray-600 mb-8 max-w-md'>
          {message || "Sorry, something went wrong on our end. Please try again later."}
        </p>
        <a
          style={{
            marginTop: "4px"
          }}
          href='/'
          className='inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300'
        >
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
