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
  Text,
  Space,
  Slider,
  theme,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleOrdinal } from '@vx/scale';
import {
  Legend,
  LegendLinear,
  LegendQuantile,
  LegendOrdinal,
  LegendSize,
  LegendThreshold,
  LegendItem,
  LegendLabel,
} from '@vx/legend';

export const VizLegend: React.FC<{
  isEditing: boolean,
  setup: any,
  plot: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ isEditing, setup, plot, config, setConfig }) => {

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
          onChange={(e)=>{setConfig({...config, legend_xRatio: parseInt(e.currentTarget.value)})}} 
          min={0} 
          max={20}
          value={config.legend_xRatio || setup.legend_xRatio} 
        />
      </Space>
    </PopoverContent>
  )

  return (
    <Popover content={configCard} placement="top-start">
    <AxisWrapper flexBasis={`${config.legend_xRatio || setup.legend_xRatio*100}%`} className={isEditing ? "EDIT_MODE" : ""}>
      <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `${label}`} labelAlign={"left"}>
        {labels => (
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            {labels.map((label, i) => (
              <LegendItem
                key={`legend-quantile-${i}`}
                onClick={() => {
                  console.log(label)
                }}
              >
                <svg height="10px">
                  <rect fill={label.value} width={"10px"} height={"10px"} />
                </svg>
                <LegendLabel>
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
          </div>
        )}
      </LegendOrdinal>
    </AxisWrapper>
    </Popover>
  );
}

// @ts-ignore
const AxisWrapper = styled(FlexItem)`
`;
