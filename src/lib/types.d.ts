export type HexColor = `#${string}`;
export type RgbColor = `rgb(${number},${number},${number}`;

export interface PowerMat {
  width: number,
  height: number,
  thickness: number,
  cornerRadius: number,
  bulge: {
    offsetLeft: number,
    width: number,
    height: number,
    portOffsetLeft: number,
    portThickness: number,
    cordThickness: number,
  },
  color?: HexColor | RgbColor
}