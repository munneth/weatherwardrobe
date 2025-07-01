import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"


interface HisHersCardProps {
    his?: boolean;
    outfitImages?: string[];
    loading?: boolean;
}

export default function HisHersCard({ his, outfitImages = [], loading = false }: HisHersCardProps){
    console.log('HisHersCard props:', { his, outfitImages, loading });
    
    return(
        <div>
            <div className="text-center">
                {his ? <h2>His</h2> : <h2>Hers</h2>}
            </div>
            <div>
                <Carousel>
                    <CarouselContent>
                        {loading ? (
                            // Loading state
                            Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
                                        <div className="text-gray-500">Generating...</div>
                                    </div>
                                </CarouselItem>
                            ))
                        ) : outfitImages.length > 0 ? (
                            // Generated outfit images
                            outfitImages.map((imageUrl, index) => (
                                <CarouselItem key={index}>
                                    <div className="w-[200px] h-[200px] rounded-lg overflow-hidden">
                                        <img 
                                            src={imageUrl} 
                                            alt={`${his ? 'His' : 'Hers'} Outfit ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log('Image failed to load:', imageUrl);
                                                e.currentTarget.src = `https://picsum.photos/200/200?random=${index}`;
                                            }}
                                        />
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            // Default placeholder images
                            Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center">
                                        <div className="text-gray-500">No outfit generated</div>
                                    </div>
                                </CarouselItem>
                            ))
                        )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}