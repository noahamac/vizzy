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
  Popover,
  PopoverContent,
  ButtonItem,
  Select,
  Text,
  Space,
  Slider,
  theme,
  ToggleSwitch,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleOrdinal } from '@vx/scale';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel,
} from '@vx/legend';

export const VizLegend: React.FC<{
  isEditing: boolean,
  data: any,
  setup: any,
  plot: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ isEditing, data, setup, plot, config, setConfig }) => {

  const legendGlyphSize = "1vw";
  const ordinalColorScale = scaleOrdinal<string, string>({
    domain: ['Country'],
    range: [config.chart_fill],
  });

  const defaults = {
    legend_xRatio: 6,
  }

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
      <Text fontSize="xxsmall" variant="subdued">Legend Width</Text>
      <Slider
          onChange={(e)=>{setConfig({...config, legend_xRatio: parseInt(e.currentTarget.value)/100})}} 
          min={0} 
          max={20}
          value={(config.legend_xRatio || setup.legend_xRatio)*100} 
        />
      </Space>
    </PopoverContent>
  )

  let dimKeys = Object.keys(data[0] || {})

  return (
    <Popover content={configCard} placement="left-start">
    <AxisWrapper flexBasis={`${(config.legend_xRatio || setup.legend_xRatio)*100}%`} pl="large" className={isEditing ? "EDIT_MODE" : ""}>
      <Space mt="small">
        <Select 
          value={config.legend_model || setup.legend_model} 
          options={[
            {label:"Niskanen", value:"Niskanen",description:"September 15, 2020"},
            {label:"Marginal Outcome", value:"Marginal Outcome",description:"September 25, 2020"},
            {label:"Combined", value:"Combined",description:"September 25, 2020"}
          ]}
          onChange={(e)=>{
            setConfig({
              ...config, 
              legend_model: e,
            })
          }}
        />
      </Space>
    </AxisWrapper>
    </Popover>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
  font-family:"Comic Sans MS";
`;
