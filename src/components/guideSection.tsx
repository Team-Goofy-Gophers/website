import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { api } from "~/utils/api";

const GuideSection = () => {
  const { data: guides } = api.guides.getAllGuides.useQuery();
  return (
    <div className="flex h-[calc(100vh-5rem)] w-full flex-col items-center justify-center gap-20 bg-background px-20 pb-20">
      <h1 className="w-full text-center text-6xl font-bold">Guides</h1>
      <Carousel orientation="vertical" className="w-full">
        <CarouselContent className="h-[400px]">
          {guides?.map((guide) => (
            <CarouselItem className="flex h-full w-full items-center justify-evenly gap-10">
              <Image
                // src="/images/profile-placeholder.png"
                src={
                  guide.images[0]
                    ? guide.images[0]
                    : "/images/profile-placeholder.png"
                }
                alt={guide.title}
                width={300}
                height={300}
              />
              <div className="flex h-[400px] w-2/3 flex-col justify-start">
                <h1 className="w-full text-center text-3xl font-bold">
                  {guide.title}
                </h1>
                <p>{guide.data}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-[185px]" />
        <CarouselNext className="absolute left-[176px]" />
      </Carousel>
    </div>
  );
};

export default GuideSection;
