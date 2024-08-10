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
    <div className="flex h-[calc(100vh-5rem)] w-screen flex-col items-center justify-center gap-10 bg-background p-10 px-20 invert">
      <h1 className="w-full text-center text-4xl font-bold">Guides</h1>
      <Carousel orientation="vertical" className="w-full">
        <CarouselContent className="h-[300px]">
          {/* {guides?.map((guide) => (
            <CarouselItem>
              <Image
                src={guide.images[0]!}
                alt={guide.title}
                width={500}
                height={500}
              />
            </CarouselItem>
          ))} */}
          {guides?.map((guide) => (
            <CarouselItem className="flex h-full w-full items-center justify-evenly gap-10">
              <Image
                // src="/images/profile-placeholder.png"
                src={
                  guide.images[0]
                    ? guide.images[0]
                    : "/images/profile-placeholder.png"
                }
                alt="profile"
                width={300}
                height={300}
              />
              <div className="flex h-[300px] w-2/3 flex-col justify-start">
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
