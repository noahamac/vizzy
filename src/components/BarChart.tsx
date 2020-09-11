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
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';

export const BarChart: React.FC<{
  data: any[],
  xPoint: (point: any) => number,
  yPoint: (point: any) => number,
  xScale: any,
  isEditing: boolean,
  setup: any,
  plot: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ data, xPoint, yPoint, xScale, isEditing, setup, plot, config, setConfig }) => {

  let colors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#4285F4"]
  let randIndex = Math.round(Math.random()*colors.length)

  return (
    <ChartWrapper flexBasis={`${config.INNER_CHART_Y_RATIO || setup.INNER_CHART_Y_RATIO*100}%`} className={isEditing ? "EDIT_MODE" : ""}>
      <svg
        style={{height: "100%"}}
        >
        {data.map((d: any, i: number) => {
          const barHeight = (plot.height*0.8) - yPoint(d);
          return (
            <Group key={`bar-${i}`}>
              <Bar
                x={xPoint(d)+(xScale.bandwidth()*0.15)}
                y={(plot.height*0.8) - barHeight}
                height={barHeight}
                width={xScale.bandwidth()*0.7}
                fill={"#4285F4"}
              />
            </Group>
          );
        })}
      </svg>
    </ChartWrapper>
  );
}

// @ts-ignore
const ChartWrapper = styled(FlexItem)`
`;
