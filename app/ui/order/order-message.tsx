import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function OrderComplete(){
    return (
        <div className="flex flex-col items-center text-white text-center">
            <div className='flex flex-row gap-4 items-center mb-8'>
              <h1 className="text-3xl font-bold">Order complete</h1>
              <FontAwesomeIcon icon={faCheckCircle}  color={'green'} className="w-10 h-10" />
            </div>
            <div className="flex flex-col  mt-4 max-w-5xl mx-auto bg-transparent items-center text-center">
                <p className="text-lg">
                    You will receive an email confirming this along with an invite to the github repo for LaunchIt.
                    Once you receive the email, accept the invite in order to gain access.
                </p>
            </div>
        </div>
    )
}
