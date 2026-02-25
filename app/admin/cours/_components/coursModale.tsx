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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" aria-hidden="true" />
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="mb-1 text-xl font-semibold text-slate-900">
                  {courseToEdit ? "Modifier le cours" : "Créer un nouveau cours"}
                </Dialog.Title>
                <p className="mb-5 text-sm text-slate-500">
                  {courseToEdit ? "Mets à jour les informations du cours." : "Renseigne les informations du nouveau cours."}
                </p>
                <CoursForm coursToEdit={courseToEdit} onSucces={onSucces} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
