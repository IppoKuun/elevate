import { inviteStaffAction } from "@/app/actions/actions_invitations";
import { useState } from "react";

export default async function invite(){
    const  [loading, setLoading] = useState(false)
    const [targetEmail, setTargetEmail] = useState("")

    async function inviteStaff(){
        try{
            const action = inviteStaffAction()
        } catch {
            
        }
    }
    return (
        <div className="">
            <section className="">

            </section>
        </div>

    )
}
