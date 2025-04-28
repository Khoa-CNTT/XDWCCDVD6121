import React from "react";

interface VayCuoi {
  id: number;
  ten: string;
  so_luong: number;
  gia: number;
}

interface Data {
  VayCuoi: VayCuoi[];
}

const AnhCuoiComponent = ({ VayCuoi }: Data) => {
  return (
    <div>
      {VayCuoi.map((item) => (
        <div key={item.id}>
          <div>{item.ten}</div>
          <div>{item.gia}</div>
          <div>{item.so_luong}</div>
        </div>
      ))}
    </div>
  );
};

export default AnhCuoiComponent;
