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
import { AxisBottom, AxisLeft } from '@vx/axis';

export const XAxis: React.FC<{
  xScale: any,
  isEditing: boolean,
  setup: any,
  plot?: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ xScale, isEditing, setup, plot, config, setConfig }) => {

  const defaults = {
    x_label_position: 'center',
    x_fontSize: "medium",
    xAxis_yRatio: 6,
  }

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Axis Label Position</Text>
        <Select 
          defaultValue={config.x_label_position || defaults.x_label_position} 
          options={[
            { value: 'left', label: 'left' },
            { value: 'center', label: 'center' },
            { value: 'right', label: 'right' },
          ]}
          onChange={(e)=>{setConfig({...config, x_label_position: e})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">X Label Font Size</Text>
        <Select 
          defaultValue={config.x_fontSize || defaults.x_fontSize} 
          options={[
            { value: 'xx-small', label: 'smallest' },
            { value: 'x-small', label: 'smaller' },
            { value: 'small', label: 'small' },
            { value: 'medium', label: 'medium' },
            { value: 'large', label: 'large' },
            { value: 'x-large', label: 'larger' },
            { value: 'xx-large', label: 'largest' },
          ]}
          onChange={(e)=>{setConfig({...config, x_fontSize: e})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">X Label Override</Text>
        <InlineInputText 
          value={config.x_label || setup.x_label} 
          onChange={(e)=>{setConfig({...config, x_label: e.currentTarget.value})}}
        />
      </Space>
      <Space mb="small">
      <Text fontSize="xxsmall" variant="subdued">X Axis Height</Text>
      <Slider
          onChange={(e)=>{setConfig({...config, xAxis_yRatio: parseInt(e.currentTarget.value)/100})}} 
          min={0} 
          max={20}
          value={(config.xAxis_yRatio || setup.xAxis_yRatio)*100} 
        />
      </Space>
    </PopoverContent>
  )

  return (
    <Popover content={configCard} placement="top-start">
    <AxisWrapper 
      flexBasis={`${(config.xAxis_yRatio || setup.xAxis_yRatio)*100}%`} 
      pt="xxsmall" 
      className={isEditing ? "EDIT_MODE" : ""}
    >
      <svg
        style={{height: "50%"}}
        >
        <AxisBottom
          left={2}
          top={2}
          scale={xScale}
          stroke={config.chart_fontColor || setup.chart_fontColor}
          tickStroke={config.chart_fontColor || setup.chart_fontColor}
          tickLabelProps={() => ({
            fill: config.chart_fontColor || setup.chart_fontColor,
            fontSize: 10,
            fontFamily: 'sans-serif',
            textAnchor: 'middle',
          })}
        />
      </svg>
      <FlexItem 
        width="100%"
        textAlign={config.x_label_position || defaults.x_label_position}
      >
        <Text 
          fontSize={config.x_fontSize || defaults.x_fontSize}
          color={config.chart_fontColor || setup.chart_fontColor}
        >
          {config.x_label || setup.x_label}
        </Text>
      </FlexItem>
    </AxisWrapper>
    </Popover>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
`;
