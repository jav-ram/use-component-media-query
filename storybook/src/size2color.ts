import { blue, green } from "@mui/material/colors";

type DimensionType = {
  width: number,
  height: number,
};

type RGBType = {
  red: number,
  green: number,
  blue: number,
}

const RGB_SIZE = 256;

export const size2color = ({ width, height }: DimensionType): RGBType => {
  return {
    red: width % RGB_SIZE,
    green: height % RGB_SIZE,
    blue: (width + height) % RGB_SIZE,
  };
};

export const color2CssColor = ({ red, green, blue }: RGBType): string => {
  return `rgb(${red}, ${green}, ${blue})`
}


export default size2color;
