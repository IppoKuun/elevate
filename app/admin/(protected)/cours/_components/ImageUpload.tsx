import { X, ImageUp } from "lucide-react"
import { useRef, useState } from "react"


interface ImageUploadProps {
    label : string,
    defaultValue : string,
    name: string
}

export default function ImageUpload({label, defaultValue, name}: ImageUploadProps ){
    const [preview, setPreview] = useState<string |null> (null)
    const inputRef = useRef<HTMLInputElement>(null)
    const displayedPreview = preview ?? (defaultValue || null)


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
        <div className="py-4">
            <label htmlFor={name} className="">{label}</label>
            <div className="relative">
                <input 
                id={name}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                ref={inputRef}
                type="file"
                accept="image/*"
                name={name}
                onChange={(e) => handleFileChange(e)}
                ></input>
                 {displayedPreview ? (
                <div className="relative">
                {preview ? (
                <button 
                className="cursor-pointer bg-black rounded-full p-2 absolute z-20 hover:bg-red-300 duration-450 transition"
                onClick={(e) => {
                        e.preventDefault()
                        handleRemove()
                        }}>
                        <X color="white"/>
                    </button>
                ) : null}
                    <img
                    src={displayedPreview}
                    alt="Preview"
                        />
                </div>
                ) : (
                    <div 
                    className="flex flex-col items-center justify-center bg-slate-50 border-3 border-slate-300 rounded-xl h-30 w-full">
                        <ImageUp />
                        <p className="text-xs font-light">Cliquez ou glisser une image ici</p>
                        <p className="text-xs font-light">JPG, PNG, WEBP (max 5Mo)</p>
                    </div>
                )
                }
            </div>
        </div>
     )
}
