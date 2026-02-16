import { StaffInvitation } from "@prisma/client"

interface invitedListProps {
        inviteList: StaffInvitation,
        totalInvite: number
}

export default function InvitedList({inviteList, totalInvite}: invitedListProps ){

    return (
        <div className="mt-10">
            {inviteList.length === 0 ? (
                <table className="">
                    <thead>
                        <tr>
                            <th className=""></th>
                        </tr>
                    </thead>
                    <tbody className="">
                        
                    </tbody>
                </table>
            ) : (
                <table className="">

                </table>
            )}

        </div>
    )
}