import React from "react";

interface CardHeaderProps {
  title: string
}

const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return (
    <div className="h-9 w-full bg-gray-700 flex justify-center items-center">
      <h2 className="text-white text-2xl font-bold">{title}</h2>
    </div>
  )
}

export default CardHeader;