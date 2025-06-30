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
}

export default function HisHersCard({ his }: HisHersCardProps){
    return(
        <div>
            <div className="text-center">
                {his ? <h2>His</h2> : <h2>Hers</h2>}
            </div>
            <div>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>
                            <Image src="/path/to/his-image1.jpg" alt="His" width={200} height={200} />
                        </CarouselItem>
                        <CarouselItem>
                            <Image src="/path/to/his-image2.jpg" alt="His" width={200} height={200} />
                        </CarouselItem>
                        <CarouselItem>
                            <Image src="/path/to/his-image3.jpg" alt="His" width={200} height={200} />
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    )
}