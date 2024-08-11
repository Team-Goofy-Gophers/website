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
  const [currentGuide, setCurrentGuide] = useState<Guide | null>(null);
  const [data, setData] = useState<string>("");
  const [newGuide, setNewGuide] = useState<boolean>(false);

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
      <div className="container flex h-[90svh] w-fit flex-col items-center justify-center gap-2 pt-[10svh]">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Guides</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col">
              {allGuides.data?.map((guide, index) => (
                <h3
                  key={index}
                  className={`cursor-pointer hover:underline ${currentGuide?.id === guide.id ? "font-bold" : ""}`}
                  onClick={() => {
                    setNewGuide(false);
                    setCurrentGuide(guide);
                    setData(guide.data);
                  }}
                >
                  {guide.title}
                </h3>
              ))}
              <h3
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
                className={newGuide ? "font-bold" : ""}
              >
                + New Guide
              </h3>
            </div>
          </CardContent>
        </Card>

        {currentGuide && (
          <Card className="py-6">
            <CardContent className="flex flex-col gap-3">
              <Input
                onChange={(e) => {
                  setCurrentGuide({ ...currentGuide, title: e.target.value });
                }}
                value={currentGuide.title}
                placeholder="Title"
              />

              <Editor setText={setData} text={data} />

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
                    className="w-full"
                  >
                    <CarouselContent>
                      {currentGuide?.images.map((url, index) => (
                        <CarouselItem
                          key={index}
                          className="basis-1/2` lg:basis-1/3"
                        >
                          <div>
                            <Card>
                              <CardContent className="aspect-auto">
                                <Image
                                  src={url}
                                  width={300}
                                  height={300}
                                  alt={`${index}`}
                                  className="aspect-video h-48 w-full rounded-lg object-cover"
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
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>

              {newGuide && (
                <>
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
                </>
              )}
              {!newGuide && (
                <>
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
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
