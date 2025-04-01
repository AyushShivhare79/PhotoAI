import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function Create() {
  return (
    <>
      <div className="flex border border-black h-screen ">
        <div className="p-2 border border-black w-[25%] space-y-5">
          <h1>Generate Images</h1>
          <Textarea
            className="resize-none"
            placeholder="Describe what you want to see"
          />
          <Button className="w-full" variant="default">
            Generate
          </Button>
        </div>
        <div className="border border-black w-full">Right</div>
      </div>
    </>
  );
}
