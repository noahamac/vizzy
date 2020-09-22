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
  InlineInputText,
  InputColor,
  SelectOptionProps,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import USAMap from "react-usa-map";
import { generateColorWheel } from "@looker/components/lib/Form/Inputs/InputColor/ColorWheel/color_wheel_utils";

export const ECMap: React.FC<{
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

  const defaults = {
    chart_fill: "#4285F4",
  }

  function getDimensions() {
    let dims = Object.keys(data[0])
    let dimsArr = dims.map((d: any, i: number) => {
      return {value: i.toString(), label: d}
    })
    return dimsArr
  }

  function getInnerChartYRatio() {
    let xaxis_y = (config.xAxis_yRatio || setup.xAxis_yRatio)
    const chart_inner_y = 1 - xaxis_y
    return chart_inner_y * 100
  }

  const mapHandler = (event) => {
    console.log(event.target.dataset.name);
  };

  const getStateColor = (call: string) => {
    if (call == "Solid Biden") {
      return "#1d789f"
    } else if (call == "Lean Biden") {
      return "#5da4c2"
    } else if (call == "Solid Trump") {
      return "#d7534e"
    } else if (call == "Lean Trump") {
      return "#fc918d"
    } else {
      return "#ddbf99"
    }
  }

  const statesCustomConfig = () => {
    let stateConfig = {}
    data.map(d=>{
      d.abbr && (stateConfig[d.abbr] = {
        fill: getStateColor(d.call)
      })
    })
    return stateConfig;
  };

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Chart fill</Text>
        <InputColor 
          onChange={(e)=>{setConfig({...config, chart_fill: e.currentTarget.value})}} 
          defaultValue={config.chart_fill || defaults.chart_fill} 
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Number of Rows</Text>
        <Slider 
          onChange={(e)=>{setConfig({...config, data_rows: parseInt(e.currentTarget.value)})}} 
          min={0} 
          max={500}
          value={config.data_rows || setup.data_rows} 
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">X Dimension</Text>
        <Select 
          defaultValue={config.data_x || setup.data_x} 
          options={getDimensions()}
          onChange={(e)=>{setConfig({...config, data_x: e})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Y Dimension</Text>
        <Select 
          defaultValue={config.data_y || setup.data_y} 
          options={getDimensions()}
          onChange={(e)=>{setConfig({...config, data_y: e})}}
        />
      </Space>
    </PopoverContent>
  )


  return (
    <Popover content={configCard} placement="right-start" focusTrap={false}>
    <ChartWrapper flexBasis={`100%`} className={isEditing ? "EDIT_MODE" : ""}>
      <USAMap customize={statesCustomConfig()} onClick={mapHandler} />
    </ChartWrapper>
    </Popover>
  );
}

// @ts-ignore
const ChartWrapper = styled(FlexItem)`
`;

