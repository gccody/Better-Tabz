import React from "react";

interface CardHeaderProps {
  title: string
}

const CardHeader: React.FC<CardHeaderProps> = ({ title }) => {
  return (
    <div className="h-9 w-full bg-gray-800 flex justify-center items-center border-b border-gray-700">
      <h2 className="text-white text-lg font-medium">{title}</h2>
    </div>
  )
}

export default CardHeader;