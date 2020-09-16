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
    y_xRatio: 10,
    y_xAdj: .94,
    y_labelShift: .5,
  }

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Label Padding</Text>
        <Slider 
          onChange={(e)=>{setConfig({...config, y_padding: parseInt(e.currentTarget.value)})}} 
          min={0} 
          max={70}
          value={config.y_padding || defaults.y_padding} 
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Label Font Size</Text>
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
        <Text fontSize="xxsmall" variant="subdued">Label Override</Text>
        <InlineInputText 
          value={config.y_label || setup.y_label} 
          onChange={(e)=>{setConfig({...config, y_label: e.currentTarget.value})}}
        />
      </Space>
      <Space mb="small">
      <Text fontSize="xxsmall" variant="subdued">Axis Width</Text>
      <Slider
          onChange={(e)=>{setConfig({...config, y_xRatio: parseInt(e.currentTarget.value)/100})}} 
          min={1} 
          max={20}
          value={(config.y_xRatio || setup.y_xRatio)*100} 
        />
      </Space>
      <Space mb="small">
      <Text fontSize="xxsmall" variant="subdued">Axis X-Adjustment</Text>
      <Slider
          onChange={(e)=>{setConfig({...config, y_xAdj: parseInt(e.currentTarget.value)/100})}} 
          min={50} 
          max={100}
          value={(config.y_xAdj || setup.y_xAdj)*100} 
        />
      </Space>
      <Space mb="small">
      <Text fontSize="xxsmall" variant="subdued">Label Y-Adjustment</Text>
      <Slider
          onChange={(e)=>{setConfig({...config, y_labelShift: parseInt(e.currentTarget.value)/100})}} 
          min={0} 
          max={100}
          value={(config.y_labelShift || defaults.y_labelShift)*100} 
        />
      </Space>
    </PopoverContent>
  )

  return (
    <Popover content={configCard} placement="right-start">
    <AxisWrapper flexBasis={`${(config.y_xRatio || setup.y_xRatio)*100}%`} className={isEditing ? "EDIT_MODE" : ""}>
        <svg
        style={{height: "100%"}}
        >
        <AxisLeft
          top={0}
          left={plot.width*(config.y_xRatio || setup.y_xRatio)*(config.y_xAdj || setup.y_xAdj)}
          scale={yScale}
          stroke={config.chart_fontColor || setup.chart_fontColor}
          tickStroke={config.chart_fontColor || setup.chart_fontColor}
          label={config.y_label || setup.y_label}
          labelOffset={config.y_padding || defaults.y_padding}
          labelClassName={"y_label"}
          labelProps={{
            fontSize: config.y_fontSize || defaults.y_fontSize,
            x: 0-plot.height*(config.y_labelShift || setup.y_labelShift),
            fill: config.chart_fontColor || setup.chart_fontColor
          }}
          tickLabelProps={() => ({
            fill: config.chart_fontColor || setup.chart_fontColor,
            fontSize: 12,
            fontFamily: 'sans-serif',
            textAnchor: 'end',
          })}
        />
      </svg>
    </AxisWrapper>
    </Popover>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
`;
