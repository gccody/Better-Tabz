import type { BookmarkTreeNode } from "../types";
import CardHeader from "./CardHeader";
import CardItem from "./CardItem";

interface CardProps {
  folder: BookmarkTreeNode;
}

const Card: React.FC<CardProps> = ({ folder }) => {
  const children = folder.children?.filter((val) => val.url) ?? [];
  return (
    <div className="flex flex-col rounded-2xl h-96 w-80 bg-gray-500 overflow-clip border-2">
      <CardHeader title={folder.title} />
      <div className="w-full overflow-auto gap-1 flex flex-1 flex-col scrollbar">
        {
          children.map((bookmark) => <CardItem key={bookmark.id} bookmark={bookmark} />)
        }
      </div>
    </div>
  )
}

export default Card;