import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { api } from "~/utils/api";

export default function AIGuide() {
  const [phase, setPhase] = useState("before");
  const [disaster, setDisaster] = useState("");
  const [language, setLanguage] = useState("english");
  const [response, setResponse] = useState<
    {
      action: string;
      description: string;
      importance: string;
      phase: string;
    }[]
  >([]);

  const guide = api.gemini.guide.useMutation();
  return (
    <div>
      <p>List all essential actions to take</p>
      <Select
        onValueChange={(value) => {
          setPhase(value);
        }}
        defaultValue="during"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Phase" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="before">Before</SelectItem>
          <SelectItem value="during">During</SelectItem>
          <SelectItem value="after">After</SelectItem>
        </SelectContent>
      </Select>
      <p>a</p>
      <Input
        placeholder="Enter disaster"
        value={disaster}
        onChange={(e) => {
          setDisaster(e.target.value);
        }}
      />
      <p>in</p>
      <Select
        onValueChange={(value) => {
          setLanguage(value);
        }}
        defaultValue="english"
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="hindi">Hindi</SelectItem>
          <SelectItem value="kannada">Kannada</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={async () => {
          await guide.mutateAsync(
            {
              phase: phase,
              disaster: disaster,
              language: language,
            },
            {
              onSuccess: (data) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                setResponse(data);
              },
            },
          );
        }}
      >
        Generate
      </Button>

      <div className="flex flex-col gap-3">
        {response.map((it, index) => (
          <div key={index}>
            <p>{it.importance}</p>
            <p>{it.action}</p>
            <p>{it.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
