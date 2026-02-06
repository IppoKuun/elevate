import { Transition, Dialog, TransitionChild } from "@headlessui/react"
import { Fragment } from "react/jsx-runtime"


interface CourseModalProps {
  isOpen: boolean; // On utilise souvent 'isOpen' par convention
  onClose: () => void;
}

export default function CoursModale({isOpen, onClose}: CourseModalProps ){

    return(
        <Transition appear as={"div"} show={isOpen}>
            <Transition.Child>
                
            </Transition.Child>
            

        </Transition>
    )

}