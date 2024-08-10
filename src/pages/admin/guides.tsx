import type { Guide } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Input } from "~/components/ui/input";

import Editor from "~/components/admin/guides/textEditor";
import { api } from "~/utils/api";

export default function Guides() {
  const allGuides = api.guides.getAllGuides.useQuery();
  const [currentGuide, setCurrentGuide] = useState<Guide | null>(null);
  const [data, setData] = useState<string>("");
  const [title, setTitile] = useState<string>("");
  const [newGuide, setNewGuide] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);

  const createGuide = api.guides.addGuide.useMutation({
    onSuccess: async () => {
      await allGuides.refetch();
      setCurrentGuide(null);
      setData("");
    },
  });
  const updateGuide = api.guides.updateGuide.useMutation({
    onSuccess: async () => {
      await allGuides.refetch();
      setCurrentGuide(null);
      setData("");
    },
  });
  return (
    <>
      <div className="container flex w-full flex-col items-center justify-center gap-2">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {allGuides.data?.map((guide, index) => (
              <CarouselItem key={index} className="basis-1/5">
                <div className="p-1">
                  <Card
                    onClick={() => {
                      setNewGuide(false);
                      setCurrentGuide(guide);
                      setData(guide.data);
                    }}
                    className="h-[10rem] w-[15rem] duration-300 hover:scale-105 hover:cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle>{guide.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      {guide.images[0] ? (
                        <Image
                          src={guide.images[0]}
                          alt={guide.title}
                          width={200}
                          height={200}
                          objectFit="cover"
                          className="aspect-video"
                        />
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {currentGuide && !newGuide && (
          <>
            <Editor setText={setData} text={data} />
            <Button
              onClick={async () => {
                await updateGuide.mutateAsync({
                  id: currentGuide.id,
                  title: currentGuide.title,
                  data,
                });
              }}
            >
              Update
            </Button>
          </>
        )}

        {newGuide && (
          <>
            <div className="flex max-w-2xl flex-col gap-4">
              <Input
                onChange={(e) => {
                  setTitile(e.target.value);
                }}
                value={title}
                placeholder="Title"
              />
              <Editor setText={setData} text={data} />
              <Button
                onClick={async () => {
                  await createGuide.mutateAsync({ title, data });
                }}
              >
                Create
              </Button>
            </div>
          </>
        )}

        <Button
          onClick={() => {
            setNewGuide(true);
            setCurrentGuide(null);
            setData("");
          }}
          className="absolute bottom-5 right-5 flex items-center justify-center"
        >
          Add New Guide
        </Button>
      </div>
    </>
  );
}
