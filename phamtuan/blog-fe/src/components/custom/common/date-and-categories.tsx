import { ResponsePostDTO } from "@/dto/PostDTO";
import { Icons } from "./icons";
import { utcToString } from "@/lib/utils";

export default function DateAndCategories({ responsePostDTO }: { responsePostDTO: ResponsePostDTO }) {
  return (
    <>
      <span className="text-[#27ba77] mr-2">{Icons.calendar()}</span>
      <span className="font-normal text-[13px] leading-[18px] text-[#525252] uppercase mr-6">
        {utcToString(responsePostDTO.publishedAt)}
      </span>
      <span className="category-in-post-review relative mr-2 font-bold font-sans text-[13px] leading-[18px] text-[#27BA77] uppercase">
        {responsePostDTO?.categories?.length ? responsePostDTO.categories[0].name : ''}
      </span>
    </>
  );
}
