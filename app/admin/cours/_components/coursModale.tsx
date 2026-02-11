import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import CoursForm from "./coursForm";
import { Course } from "@/app/type";


interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit: Course | null;
  onSucces: (msg: string) => void;
}

export default function CoursModale({ isOpen, onClose, courseToEdit, onSucces }: CourseModalProps) {
  return (
    <Transition show={isOpen} appear as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 mb-4">
                  {courseToEdit ? "Modifier le cours" : "Créer un nouveau cours"}
                </Dialog.Title>
                <CoursForm coursToEdit={courseToEdit} onSucces={onSucces} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
