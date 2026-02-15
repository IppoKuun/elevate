import { X } from "lucide-react"
import { useRef, useState } from "react"

interface ImageUploadProps {
    label : string,
    defaultValue : string,
    name: string
}

export default function ImageUpload({label, defaultValue, name}: ImageUploadProps ){
    const [preview, setPreview] = useState(null)
    const inputRef = useRef<HTMLInputElement>(null)


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file){
        const fileURL = URL.createObjectURL(file)
        setPreview(fileURL)
    }
    }

    const handleRemove = () => {setPreview(null) 
        if (inputRef.current) {
            inputRef.current.value = ""
        }
     }

     return (
        <div className="">
            <label className="">{label}</label>
            <input 
            className="absolute inset-0"
            ref={inputRef}
            name={name}
            accept="image"
            onChange={(e) => handleFileChange}
            defaultValue={defaultValue}
            ></input>
            {preview && (
                <X />
            )}
        </div>
     )
}