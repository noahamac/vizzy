import React, { useState, useEffect, useMemo, useRef } from "react";
import { Group } from '@vx/group';
import { Circle } from '@vx/shape';
import { AxisBottom, AxisLeft } from '@vx/axis';
import genRandomNormalPoints, {
    PointsRange,
  } from '@vx/mock-data/lib/generators/genRandomNormalPoints';
import { scaleLinear } from '@vx/scale';



export const Scatter: React.FC<{
    data: any, 
    X: any, 
    Y: any, 
    _xScale: any, 
    _yScale: any, 
    compose: any, 
    xPoint: any, 
    yPoint: any, 
    xTickFormat: any 
}> = ({ data, X, Y, _xScale, _yScale, compose, xPoint, yPoint, xTickFormat }) => {
    console.log(data)
    const points: PointsRange[] = genRandomNormalPoints(600).filter((d, i) => i < 600);
    console.log(points)

    const x = (d: PointsRange) => d[0];
    const y = (d: PointsRange) => d[1];
    const svgRef = useRef<SVGSVGElement>(null);
    const width = 350
    const height = 350
    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [1, 2.2],
          range: [0, width],
          clamp: true,
        }),
      [width],
    );
    const yScale = useMemo(
      () =>
        scaleLinear<number>({
          domain: [0.7, 1.6],
          range: [height, 0],
          clamp: true,
        }),
      [height],
    );
    return(
        <svg width={width} height={height} ref={svgRef}>
        <Group pointerEvents="none">
        <AxisLeft
          top={0}
          left={10}
          scale={yScale}
          labelClassName={"y_label"}
          stroke={"#fff"}
          tickStroke={"fff"}
          tickLabelProps={() => { return {fill: "#fff"}}}
        />
          {points.map((point, i) => (
            <Circle
              key={`point-${point[0]}-${i}`}
              className="dot"
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={i % 3 === 0 ? 2 : 3}
              fill={'#f6c431'}
            />
          ))}
        <AxisBottom
          top={height+15}
          left={5}
          scale={xScale}
          stroke={"#fff"}
          tickLabelProps={() => { return {fill: "#fff"}}}
        />
        </Group>
      </svg>
    )
}