import { RefreshIcon } from "@heroicons/react/solid";

const Button = ({
  loading,
  onClick,
  text,
}: {
  loading?: boolean;
  onClick?: () => void;
  text: string;
}) => {
  return (
    <button
      className="mt-3 w-full whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
      onClick={onClick}
    >
      {loading && (
        <>
          <RefreshIcon
            aria-hidden={true}
            className="animate-spin h-4 w-4 -ml-0.5 mr-3"
          />
          Pending
        </>
      )}
      {!loading && text}
    </button>
  );
};

export default Button;
