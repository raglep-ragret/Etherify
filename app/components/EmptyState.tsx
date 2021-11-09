import { MusicNoteIcon } from "@heroicons/react/solid";
import React from "react";

const EmptyState = ({
  message,
  truncateTopMargin,
}: {
  message: string;
  truncateTopMargin?: boolean;
}) => (
  <div
    className={`relative block max-w-2xl w-full border-2 border-gray-500 border-dashed rounded-lg p-12 text-center hover:border-gray-400 ${
      truncateTopMargin ? "mt-6" : "mt-24"
    }`}
  >
    <MusicNoteIcon className="mx-auto h-12 w-12" />
    <span className="mt-2 block text-sm font-medium">{message}</span>
  </div>
);

export default EmptyState;
