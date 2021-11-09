import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { ExclamationCircleIcon, XIcon } from "@heroicons/react/solid";
import { useAppDispatch } from "../redux/hooks";
import {
  removeNotification,
  TNotification,
  TNotificationType,
} from "../redux/slices/notificationSlice";

export default function Notification({
  id,
  message,
  title,
  type,
}: TNotification) {
  const [show, setShow] = useState(true);

  const dispatch = useAppDispatch();

  const hide = () => setShow(false);

  const remove = () => setTimeout(() => dispatch(removeNotification(id)), 300);

  return (
    <Transition
      afterLeave={remove}
      appear
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      show={show}
    >
      <div className="max-w-sm w-full bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {type === "success" ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
              ) : (
                <ExclamationCircleIcon
                  className="h-6 w-6 text-red-400"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {title}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 break-words">
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white dark:bg-black rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black focus:ring-green-500"
                onClick={hide}
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
