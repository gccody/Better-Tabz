import CardHeader from "@/components/CardHeader";
import CardItem from "@/components/CardItem";
import type { BookmarkTreeNode } from "@/types";

interface CardProps {
  folder: BookmarkTreeNode;
}

const Card: React.FC<CardProps> = ({ folder }) => {
  const children = folder.children?.filter((val) => val.url) ?? [];

  const handleContxtMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
  }

  return (
    <div className="flex flex-col rounded-lg h-96 w-80 bg-gray-800 border border-gray-700 shadow-md overflow-hidden" onContextMenu={handleContxtMenu}>
      <CardHeader title={folder.title} />
      <div className="w-full overflow-auto flex flex-1 flex-col scrollbar">
        {
          children.map((bookmark) => <CardItem key={bookmark.id} bookmark={bookmark} />)
        }
      </div>
    </div>
  )
}

export default Card;