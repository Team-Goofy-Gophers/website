import { Guide } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";

import { api } from "~/utils/api";

import GuideBot from "./gopherAI/guideBot";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const GuideSection = () => {
  const { data: guides } = api.guides.getAllGuides.useQuery();
  const [currentGuide, setCurrentGuide] = useState<Guide | null>(null);

  return (
    <>
      <div className="my-auto flex h-[90svh] w-full flex-col gap-4 pt-[10svh] md:flex-row">
        <Card className="h-full w-full gap-4 overflow-y-scroll p-6 md:w-1/3">
          <CardHeader>
            <h1 className="text-center text-2xl font-bold">Guides</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {guides?.map((g, index) => (
              <Card key={index} onClick={() => setCurrentGuide(g)}>
                <CardHeader>{g.title}</CardHeader>
                <CardContent>
                  <Image
                    src={
                      g.images[0]
                        ? g.images[0]
                        : "/images/profile-placeholder.png"
                    }
                    alt={g.title}
                    width={300}
                    height={300}
                    className="aspect-video h-48 w-full rounded-lg object-cover"
                  />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="h-full w-full overflow-y-scroll md:w-2/3">
          <CardContent className="flex flex-col items-start justify-center gap-4 p-6">
            {currentGuide ? (
              <>
                <h1 className="text-3xl font-bold">{currentGuide?.title}</h1>
                <Carousel className="w-full">
                  <CarouselContent>
                    {currentGuide?.images.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-1/2 lg:basis-1/3"
                      >
                        <Image
                          src={image}
                          alt={currentGuide.title}
                          width={300}
                          height={300}
                          className="aspect-video h-48 w-full rounded-lg border object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselNext />
                  <CarouselPrevious />
                </Carousel>

                <p
                  dangerouslySetInnerHTML={{ __html: currentGuide?.data ?? "" }}
                ></p>
              </>
            ) : (
              <h1 className="flex h-full w-full flex-col !items-center justify-center text-3xl font-bold">
                Select a guide
              </h1>
            )}
          </CardContent>
        </Card>
      </div>

      <GuideBot />
    </>
  );
};

export default GuideSection;
