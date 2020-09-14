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
  Slider,
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
    y_padding: 36,
    y_fontSize: "medium",
    y_label: "Hello world",
  }

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Y Label Padding</Text>
        <Slider 
          onChange={(e)=>{setConfig({...config, y_padding: parseInt(e.currentTarget.value)})}} 
          min={0} 
          max={70}
          value={config.y_padding || defaults.y_padding} 
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Y Label Font Size</Text>
        <Select 
          defaultValue={config.y_fontSize || defaults.y_fontSize} 
          options={[
            { value: 'xx-small', label: 'smallest' },
            { value: 'x-small', label: 'smaller' },
            { value: 'small', label: 'small' },
            { value: 'medium', label: 'medium' },
            { value: 'large', label: 'large' },
            { value: 'x-large', label: 'larger' },
            { value: 'xx-large', label: 'largest' },
          ]}
          onChange={(e)=>{setConfig({...config, y_fontSize: e})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Y Label Override</Text>
        <InlineInputText 
          value={config.y_label || setup.y_label} 
          onChange={(e)=>{setConfig({...config, y_label: e.currentTarget.value})}}
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
          label={config.y_label || setup.y_label}
          labelOffset={config.y_padding || defaults.y_padding}
          labelClassName={"y_label"}
          labelProps={{
            fontSize: config.y_fontSize || defaults.y_fontSize,
            x: 0-plot.height*(config.INNER_CHART_Y_RATIO*0.5 || setup.INNER_CHART_Y_RATIO*0.5),
          }}
        />
      </svg>
    </AxisWrapper>
    </Popover>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
`;
