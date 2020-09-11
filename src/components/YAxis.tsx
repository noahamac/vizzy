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
  Popover,
  PopoverContent,
  Select,
  Space,
  InlineInputText
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisLeft } from '@vx/axis';

export const YAxis: React.FC<{
  yScale: any,
  isEditing: boolean,
  setup: any,
  plot: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ yScale, isEditing, setup, plot, config, setConfig, }) => {

  const defaults = {
    fontSize: "large",
    position: "center",
    description: "",
    descFontSize: "xsmall",
  }

  useEffect(() => {
    return () => {
      setConfig({...defaults, ...config})
    };
  }, []);

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Title Position</Text>
        <Select 
          defaultValue={config.position || defaults.position} 
          options={[
            { value: 'left', label: 'left' },
            { value: 'center', label: 'center' },
            { value: 'right', label: 'right' },
          ]}
          onChange={(e)=>{setConfig({...config, position: e})}}
        />
      </Space>
    </PopoverContent>
  )

  return (
    <Popover content={configCard} placement="right-start">
    <AxisWrapper flexBasis={`${config.YAXIS_X_RATIO || setup.YAXIS_X_RATIO*100}%`} className={isEditing ? "EDIT_MODE" : ""}>
      <svg
        style={{height: "100%"}}
        >
        <AxisLeft
          top={0}
          left={plot.width*(config.YAXIS_X_RATIO || setup.YAXIS_X_RATIO*0.94)}
          scale={yScale}
          stroke={"#282828"}
          tickStroke={"#282828"}
          label={"nothing for now"}
        />
      </svg>
    </AxisWrapper>
    </Popover>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
`;
