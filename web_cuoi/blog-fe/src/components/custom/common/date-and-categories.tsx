import { ResponsePostDTO } from "@/dto/PostDTO";
import { Icons } from "./icons";
import { utcToString } from "@/lib/utils";

export default function DateAndCategories({ responsePostDTO }: { responsePostDTO: ResponsePostDTO }) {
  return (
    <div className="flex items-center text-[#888888]">
      <span className="mr-1.5 flex items-center">{Icons.clock()}</span>
      <span className="font-semibold text-[13px] leading-[18px] uppercase">
        {utcToString(responsePostDTO.publishedAt)}
      </span>
    </div>
  );
}
