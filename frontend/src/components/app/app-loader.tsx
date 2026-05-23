export default function AppLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        width="48"
        height="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 19.2c1.4-1.4 1.4-3.6 0-5 1.4-1.4 3.6-1.4 5 0l3.5-3.5-3.5-3.5c-1.4-1.4-3.6-1.4-5 0-1.4 1.4-1.4 3.6 0 5l-3.5 3.5 3.5 3.5z"></path>
        <path d="M12 24c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10z"></path>
      </svg>
    </div>
  );
}
