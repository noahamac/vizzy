/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React, { useState, useEffect } from "react";
import {
  Chip,
  Flex,
  FlexItem,
  Heading,
  Button,
  Spinner,
  Text,
  theme,
  getWindowedListBoundaries,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import {  } from "../utils/routes"
import {  } from "./interfaces";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { ViolinPlot, BoxPlot } from '@vx/stats';
import { LinearGradient } from '@vx/gradient';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@vx/tooltip';
import { WithTooltipProvidedProps } from '@vx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@vx/pattern';

export const Boxplot: React.FC<{
  data: any[],
  xScale: any,
  yScale: any,
  boxWidth: any,
  plot: any,
  pHeight: number,
}> = ({ data, xScale, yScale, boxWidth, plot, pHeight, }) => {

  const x = (d: any) => d.boxPlot.x;
  const min = (d: any) => d.boxPlot.min;
  const max = (d: any) => d.boxPlot.max;
  const median = (d: any) => d.boxPlot.median;
  const firstQuartile = (d: any) => d.boxPlot.firstQuartile;
  const thirdQuartile = (d: any) => d.boxPlot.thirdQuartile;
  const outliers = (d: any) => d.boxPlot.outliers;

  function getSeries(datas: any[]) {
    let datum = datas.sort((x: any, y: any) => { return x.value - y.value })
    let startIndex = 20
    let endIndex = 65
    let rollup = []
    while (startIndex <= endIndex) {
      let enc = datum.filter(d => { return Math.round(d.value) === startIndex }).reduce((a, b) => +a + +b.count, 0);
      enc > 0 && rollup.push({value:startIndex,count:enc})
      startIndex++;
    }
    console.log(rollup)
    return rollup
  }

  return (
    <ChartWrapper flexBasis={`${pHeight*100}%`} className="shown">
      <svg
        style={{height: "100%"}}
        >
          <Group top={40}>
            {data.map((d: any, i) => (
              <g key={i}>
                <ViolinPlot
                  data={getSeries(d.binData)}
                  stroke={d.boxPlot.y === "Biden" ? "#4285F4" : "#DB4437"}
                  left={d.boxPlot.y === "Biden" ? xScale(x(d))! + (0.3 * boxWidth) - 15 : xScale(x(d))! + (0.3 * boxWidth) + 15 }
                  width={boxWidth*0.4}
                  valueScale={yScale}
                  fillOpacity={0.2}
                  fill={d.boxPlot.y === "Biden" ? "#4285F4" : "#DB4437"}
                />
                <BoxPlot
                  min={min(d)}
                  max={max(d)}
                  left={d.boxPlot.y === "Biden" ? xScale(x(d))! + (0.425 * boxWidth) - 15 : xScale(x(d))! + (0.425 * boxWidth) + 15 }
                  firstQuartile={firstQuartile(d)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={boxWidth*0.15}
                  fill="#FFFFFF"
                  fillOpacity={0.0}
                  stroke={d.boxPlot.y === "Biden" ? "#4285F4" : "#DB4437"}
                  strokeWidth={1}
                  valueScale={yScale}
                  outliers={outliers(d)}
                />
              </g>
            ))}
          </Group>
        </svg>

        {/* {tooltipOpen && tooltipData && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
          >
            <div>
              <strong>{tooltipData.name}</strong>
            </div>
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {tooltipData.max && <div>max: {tooltipData.max}</div>}
              {tooltipData.thirdQuartile && <div>third quartile: {tooltipData.thirdQuartile}</div>}
              {tooltipData.median && <div>median: {tooltipData.median}</div>}
              {tooltipData.firstQuartile && <div>first quartile: {tooltipData.firstQuartile}</div>}
              {tooltipData.min && <div>min: {tooltipData.min}</div>}
            </div>
          </Tooltip>
        )} */}
    </ChartWrapper>
  );
}

// @ts-ignore
const ChartWrapper = styled(FlexItem)`
`;
