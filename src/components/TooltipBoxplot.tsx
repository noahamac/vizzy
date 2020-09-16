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
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisRight } from '@vx/axis';
import { BoxPlot } from '@vx/stats';
import { LinearGradient } from '@vx/gradient';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@vx/tooltip';
import { WithTooltipProvidedProps } from '@vx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@vx/pattern';
import { width } from "styled-system";

export const TooltipBoxplot: React.FC<{
  data: any[],
  height: number,
  width: number,
  rep: string,
  id: number
}> = ({ data, height, width, id, rep}) => {

 data = [data[id]]

  const x = (d: any) => d['Start Week'];
  const min = (d: any) => parseFloat(d['Min Pct']['Campaign'][rep].substring(0, d['Min Pct']['Campaign'][rep].length-1));
  const max = (d: any) => parseFloat(d['Max Pct']['Campaign'][rep].substring(0, d['Max Pct']['Campaign'][rep].length-1));
  const median = (d: any) => parseFloat(d['Median Pct']['Campaign'][rep].substring(0, d['Median Pct']['Campaign'][rep].length-1));
  const firstQuartile = (d: any) => parseFloat(d['Fq Pct']['Campaign'][rep].substring(0, d['Fq Pct']['Campaign'][rep].length-1));
  const thirdQuartile = (d: any) => parseFloat(d['Tq Pct']['Campaign'][rep].substring(0, d['Tq Pct']['Campaign'][rep].length-1));
  const outliers = (d: any) => []

  const xScale = scaleBand<string>({
    rangeRound: [0, width],
    domain: data.map(x),
  });

  const yScale = scaleLinear<number>({
    rangeRound: [height, 0],
    domain: [30-5, 70],
  });

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
    return rollup
  }

  return (
    <ChartWrapper flexBasis={`${height*100}%`}>
      <svg
        style={{height: "100%"}}
        >
            <AxisRight
                top={15}
                left={width-30}
                scale={yScale}
                labelClassName={"y_label"}
                stroke={"#fff"}
                tickStroke={"fff"}
                tickLabelProps={() => { return {
                    fontSize: 12,
                    fill: "#fff",
                    textAnchor: 'inherit',
                }}}
            />


        
          <Group >
            {data.map((d: any, i) => (
              <g key={i}>
                <BoxPlot
                  min={min(d)}
                  max={max(d)}
                  left={xScale(x(d))! + (0.425 * xScale.bandwidth())}
                  firstQuartile={firstQuartile(d)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={xScale.bandwidth()*0.15}
                  fill="#FFFFFF"
                  fillOpacity={0.0}
                  stroke={rep === "Biden" ? "#4285F4" : "#DB4437"}
                  strokeWidth={2}
                  valueScale={yScale}
                  outliers={outliers(d)}
                />
              </g>
            ))}
          </Group>
        </svg>
        {/* : "#DB4437" */}
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
