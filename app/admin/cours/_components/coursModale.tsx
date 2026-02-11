import { Transition, Dialog, TransitionChild } from "@headlessui/react"
import { Fragment } from "react/jsx-runtime"
import CoursForm from "./coursForm";


interface CourseModalProps {
  isOpen: boolean; // On utilise souvent 'isOpen' par convention
  onClose: () => void;
  courseToEdit: Boolean
}

export default function CoursModale({isOpen, onClose, courseToEdit}: CourseModalProps ){

    return(
        <Transition show={isOpen} appear as={Fragment}>
            <Dialog as="div" onClose={onClose} >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-500"
                    enterFrom="opacitiy-0"
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
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacitiy-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                             <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                                                {courseToEdit ? "Modifier le cours" : "Créer un nouveau cours"}
                                                </Dialog.Title>
                        </Dialog.Panel>

                        <CoursForm coursToEdit={courseToEdit}  />

                        </Transition.Child>
                </div>
            </div>
            </Dialog>
        </Transition>
    )

}