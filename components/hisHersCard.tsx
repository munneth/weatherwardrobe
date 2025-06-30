import Image from "next/image";

interface HisHersCardProps {
    his?: boolean;
}

export default function HisHersCard({ his }: HisHersCardProps){
    return(
        <div>
            <div className="text-center">
                {his ? <h2>His</h2> : <h2>Hers</h2>}
            </div>
            <div className="bg-[#70798C] p-12">
                <div className="bg-amber-50 p-20">
                    <Image 
                        src="/path/to/his-image.jpg" 
                        alt="His" 
                        width={200}   // <-- Add width
                        height={200}  // <-- Add height
                    />
                </div>
            </div>
        </div>
    )
}