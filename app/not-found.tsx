import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-dark text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mb-4 text-2xl font-bold text-dark dark:text-white">
        Oops! Page Not Found
      </h2>
      <p className="mb-8 text-lg text-body-color dark:text-body-color-dark">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded bg-primary px-8 py-3 text-base font-semibold text-white transition hover:bg-opacity-90"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
