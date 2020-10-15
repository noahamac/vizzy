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
  Tooltip,
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
// import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@vx/tooltip';
import { WithTooltipProvidedProps } from '@vx/tooltip/lib/enhancers/withTooltip';
import { PatternLines } from '@vx/pattern';
import { width } from "styled-system";
import { LinePath } from '@vx/shape';

export const TooltipBoxplot: React.FC<{
  data: any[],
  height: number,
  width: number,
}> = ({ data, height, width}) => {

  data = [data]

  const x = (d: any) => d["Forecast Lookup Forecast"];
  const min = (d: number) => d["Margins Min Margin"];
  const max = (d: number) => d["Margins Max Margin"];
  const median = (d: any) => d["Margins Median Margin"];
  const firstQuartile = (d: any) => d["Margins Fq Margin"];
  const thirdQuartile = (d: any) => d["Margins Tq Margin"];
  const outliers = (d: any) => []

  const xScale = scaleBand<string>({
    rangeRound: [0, width],
    domain: data.map(x),
  });

  const yScale = scaleLinear<number>({
    rangeRound: [height*0.95, 5],
    domain: [Math.min(data[0]["Margins Min Margin"], 0), Math.max(data[0]["Margins Max Margin"], 0)],
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

  const getStateColor = (call: string) => {
    if (call == "Solid Biden") {
      return "#00B8F5"
    } else if (call == "Lean Biden") {
      return "#47D1FF"
    } else if (call == "Solid Trump") {
      return "#FF6B6B"
    } else if (call == "Lean Trump") {
      return "#FF9999"
    } else {
      return "#7A55E3"
    }
  }

  return data[0]["Forecast Lookup Poll Forecast"] !== "No Polling" && (
    <ChartWrapper flexBasis={`${height*100}%`} >
      <Tooltip placement="right" content={<>
        <FlexItem>{`max: ${data[0]["Margins Max Margin"]}%`}</FlexItem>
        <FlexItem>{`Q3: ${data[0]["Margins Tq Margin"]}%`}</FlexItem>
        <FlexItem>{`median: ${data[0]["Margins Median Margin"]}%`}</FlexItem>
        <FlexItem>{`Q1: ${data[0]["Margins Fq Margin"]}%`}</FlexItem>
        <FlexItem>{`min: ${data[0]["Margins Min Margin"]}%`}</FlexItem>
        </>}>
      <svg
        style={{height: "100%"}}
        >
            <AxisRight
                top={0}
                left={37}
                scale={yScale}
                labelClassName={"y_label"}
                stroke={"#282828"}
                tickStroke={"#282828"}
                numTicks={3}
                tickLength={4}
                tickLabelProps={() => { return {
                    fontSize: 10,
                    fill: "#282828",
                    textAnchor: "start"
                }}}
            />
            {width > 8 &&
          data.map((lineData, i) => {
            return (
              <Group key={`lines-${i}`} top={yScale(0)} left={0}>
                <rect
                  rx={x(lineData)}
                  ry={yScale(0)}
                  stroke="#282828"
                  width="35px"
                  height=".5px"
                  fill="none"
                  strokeDasharray="5,0,0,0"
                  strokeWidth={1}
                />
              </Group>
            );
          })}
          <Group >
            {data.map((d: any, i) => (
              <g key={i}>
                <BoxPlot
                  min={min(d) || 0.01}
                  max={max(d) || 0.01}
                  left={15}
                  firstQuartile={firstQuartile(d) || 0.01}
                  thirdQuartile={thirdQuartile(d) || 0.01}
                  median={median(d) || 0.01}
                  boxWidth={xScale.bandwidth()*0.3}
                  fill="#FFFFFF"
                  fillOpacity={0.0}
                  stroke={getStateColor(data[0]["Forecast Lookup Forecast"])}
                  strokeWidth={3}
                  valueScale={yScale}
                  outliers={outliers(d)}
                />
              </g>
            ))}
          </Group>
        </svg>
        </Tooltip>
    </ChartWrapper>
  );
}

// @ts-ignore
const ChartWrapper = styled(FlexItem)`
`;
