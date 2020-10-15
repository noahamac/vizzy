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
import { forecast } from "./ecv_forecast";
import { NiskanenMap } from "./NiskanenMap";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import USAMap from "react-usa-map";
import { generateColorWheel } from "@looker/components/lib/Form/Inputs/InputColor/ColorWheel/color_wheel_utils";
import { BarStackHorizontal } from '@vx/shape';

export const ECBar: React.FC<{
  top: any[],
  isEditing: boolean,
  setup: any,
  plot: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ top, isEditing, setup, plot, config, setConfig }) => {

  const defaults = {
    chart_fill: "#4285F4",
  }

  function getInnerChartYRatio() {
    let xaxis_y = (config.xAxis_yRatio || setup.xAxis_yRatio)
    const chart_inner_y = 1 - xaxis_y
    return chart_inner_y * 100
  }


  const getStateColor = (call: string) => {
    if (call == "1 Solid Biden") {
      return "#00B8F5"
    } else if (call == "2 Lean Biden") {
      return "#47D1FF"
    } else if (call == "5 Solid Trump") {
      return "#FF6B6B"
    } else if (call == "4 Lean Trump") {
      return "#FF9999"
    } else {
      return "#7A55E3"
    }
  }

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
    </PopoverContent>
  )

  const call_keys = Object.keys(top[0]).filter(d => d !== 'model')
  const yMax = (plot.height*0.9)
  const getModel = (d) => d.model;
  const voteScale = scaleLinear<number>({
    domain: [0, 538],
    nice: true,
  });
  const modelScale = scaleBand<string>({
    domain: ["0"],
    padding: 0.2,
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: call_keys,
    range: ["#00B8F5", "#47D1FF", "#7A55E3", "#FF9999", "#FF6B6B"],
  });

  function getWConst() {
    return Math.min(setup.CHART_X_RATIO*plot.width,setup.CHART_X_RATIO*800)
  }


  return (
    <Popover content={configCard} placement="right-start" focusTrap={false}>
    <ChartWrapper flexBasis={`3%`} className={isEditing ? "EDIT_MODE" : ""}>
    <svg height={`${0.075*plot.height}`} width={`100%`}>
          <Group>
            <BarStackHorizontal<string, string>
              data={top}
              keys={call_keys}
              y={getModel}
              xScale={voteScale}
              yScale={modelScale}
              color={colorScale}
            >
              {barStacks =>
                barStacks.map(barStack =>
                  barStack.bars.map(bar => (
                    <rect
                      key={`barstack-horizontal-${barStack.index}-${bar.index}`}
                      x={bar.x*getWConst()}
                      y={bar.y}
                      width={bar.width*getWConst()}
                      height={"100%"}
                      fill={bar.color}
                      stroke={"#f0e6e6"}
                      strokeWidth={"3px"}
                    />
                  ))
                )
              }
            </BarStackHorizontal>
          </Group>
          {[top].map((lineData, i) => {
            return (
              <Group key={`lines-${i}`} left={voteScale(270)*getWConst()} top={0}>
                <rect
                  ry={0}
                  rx={voteScale(270)*getWConst()}
                  stroke="#f0e6e6"
                  fill="none"
                  width="1px"
                  height="100px"
                  strokeDasharray="6 8"
                  strokeWidth={4}
                  strokeOpacity={1}
                />
              </Group>
            );
          })}
        </svg>
        <Flex>
          <FlexItem flexBasis={`50%`}>
            <Flex>
              <FlexItem><Heading>Joe Biden (D)</Heading></FlexItem>
              <FlexItem><Heading fontWeight="semiBold" ml="small">{`${top[0].lean_biden + top[0].solid_biden} votes`}</Heading></FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem flexBasis={`50%`}>
            <Flex>
              <FlexItem><Heading>Donald Trump (R)</Heading></FlexItem>
              <FlexItem><Heading fontWeight="semiBold" ml="small">{`${top[0].lean_trump + top[0].solid_trump} votes`}</Heading></FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
    </ChartWrapper>
    </Popover>
  );
}

// @ts-ignore
const ChartWrapper = styled(FlexItem)`
`;

