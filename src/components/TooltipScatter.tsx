import React, { useMemo, useRef } from "react";
import { Group } from '@vx/group';
import { Circle } from '@vx/shape';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleLinear } from '@vx/scale';


export const TooltipScatter: React.FC<{
  data: any, 
  id: any,
  width: number,
  height: number,
  fieldX: string,
  fieldY: string
}> = ({ data, id, width, height, fieldX, fieldY }) => {
  
  //Scale chart
  innerWidth  = width*0.80
  innerHeight = height*0.80
  
  const x = (d: any) => d[fieldX];
  const y = (d: any) => d[fieldY];

  //Filter null values
  data = data.filter(e => e[fieldX] !== null)
  
  const svgRef = useRef<SVGSVGElement>(null);
  const xScale = useMemo(
    () =>
    scaleLinear<number>({
      domain: [Math.min(...data.map(x))+1, Math.max(...data.map(x))],
      range: [0, innerWidth],
      clamp: true,
    }),
    [width],
  );

  const yScale = useMemo(
    () =>
    scaleLinear<number>({
      domain: [Math.min(...data.map(y))+1, Math.max(...data.map(y))],
      range:  [innerHeight, 0],
      clamp: true,
    }),
    [height],
  );

  return(
    <svg width={innerWidth} height={innerHeight} ref={svgRef}>
      <AxisLeft
        top={30}
        left={25}
        scale={yScale}
        labelClassName={"y_label"}
        stroke={"#fff"}
        tickStroke={"fff"}
        tickLabelProps={() => { 
          return {
            fontSize: 8,
            fill: "#fff",
            textAnchor: 'end',
          }
        }}
      />

      <Group left={30} top={25} pointerEvents="none">
        {data.map( (point, i) => { 
          return (
            <Circle
              key={`point-${point[0]}-${i}`}
              className="dot"
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={i % 3 === 0 ? 2 : 3}
              fill={((id, i) => { return id == i ? '#f6c431' : '#228B22'; })(id,i)}
            />
          )
        })}
      </Group>

      <AxisBottom
        top={height*0.90}
        left={25}
        scale={xScale}
        stroke={"#fff"}
        tickStroke={"#fff"}
        tickLabelProps={() => { 
          return {
            fontSize: 8,
            fill: "#fff",
          }
        }}
      />
    </svg>
  )
  
}