import type { Guide } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [currentGuide, setCurrentGuide] = useState<Guide>({
    id: "",
    title: "",
    data: "",
    images: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [data, setData] = useState<string>("");
  const [newGuide, setNewGuide] = useState<boolean>(false);

  const createGuide = api.guides.addGuide.useMutation({
    onSuccess: async () => {
      await allGuides.refetch();
      setCurrentGuide({
        id: "",
        title: "",
        data: "",
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setData("");
    },
  });
  const updateGuide = api.guides.updateGuide.useMutation({
    onSuccess: async () => {
      await allGuides.refetch();
      setCurrentGuide({
        id: "",
        title: "",
        data: "",
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
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

        <Card className="relative w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gallery</CardTitle>
            <CldUploadButton
              onSuccess={(res: CloudinaryUploadWidgetResults) => {
                setCurrentGuide({
                  ...currentGuide,
                  images: currentGuide.images.concat(
                    //@ts-expect-error nothing
                    res?.info.secure_url as string,
                  ),
                });
                console.log(res);
              }}
              uploadPreset="ot0jbym5"
              className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
            >
              Add Image
            </CldUploadButton>
          </CardHeader>

          <CardContent className="flex w-full justify-center">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl"
            >
              <CarouselContent>
                {currentGuide?.images.map((url, index) => (
                  <CarouselItem key={index} className="relative">
                    <div>
                      <Card>
                        <CardContent className="aspect-auto">
                          <Image
                            src={url}
                            width={200}
                            height={200}
                            alt={`${index}`}
                            className="h-[10rem] w-[20rem] object-cover"
                          />
                        </CardContent>
                      </Card>
                    </div>

                    <span
                      className="absolute right-5 top-3 cursor-pointer rounded-full bg-red-500 p-4"
                      onClick={() => {
                        setCurrentGuide({
                          ...currentGuide,
                          images: currentGuide.images.filter(
                            (_, i) => i !== index,
                          ),
                        });
                      }}
                    >
                      <Trash2Icon size={20} />
                    </span>
                  </CarouselItem>
                ))}

                <CarouselItem>
                  <Card
                    onClick={() => {
                      setNewGuide(true);
                      setCurrentGuide({
                        id: "",
                        title: "",
                        data: "",
                        images: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                      });
                      setData("");
                    }}
                    className="absolute bottom-5 right-5 flex items-center justify-center"
                  >
                    <CardContent>Add New Guide</CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>

        {currentGuide && !newGuide && (
          <>
            <Editor setText={setData} text={data} />
            <Button
              onClick={async () => {
                await updateGuide.mutateAsync({
                  id: currentGuide.id,
                  title: currentGuide.title,
                  data: data,
                  images: currentGuide.images,
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
                  setCurrentGuide({ ...currentGuide, title: e.target.value });
                }}
                value={currentGuide.title}
                placeholder="Title"
              />
              <Editor setText={setData} text={data} />
              <Button
                onClick={async () => {
                  if (currentGuide.title === "") return;
                  await createGuide.mutateAsync({
                    title: currentGuide.title,
                    data,
                    images: currentGuide.images,
                  });
                }}
              >
                Create
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
