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
import {  } from "../utils/routes"
import {  } from "./interfaces";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisBottom } from '@vx/axis';

export const XAxis: React.FC<{
  label: string,
  xTickFormat: any,
  xScale: any,
  plot: any,
  pHeight: number,
}> = ({ label, xTickFormat, xScale, plot, pHeight, }) => {
  return (
    <AxisWrapper flexBasis={`${pHeight*100}%`} className="shown">
      <svg
        style={{height: "100%"}}
        >
        <AxisBottom
          top={5}
          scale={xScale}
          stroke={"#282828"}
          tickStroke={"#282828"}
          label={label}
        />
      </svg>
    </AxisWrapper>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
`;
