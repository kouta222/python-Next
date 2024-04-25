import React from "react";

type CardProps = {
  id: number;
  name: string;
  email: string;
};

const CardComponets = (props: CardProps) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100 ">
      <h1 className="text-lg text-gray-600">{props.name}</h1>
      <p className="text-md text-gray-700">{props.email}</p>
    </div>
  );
};

export default CardComponets;
