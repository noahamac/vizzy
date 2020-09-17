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

import React, { useEffect, useState } from "react";
import {
  Flex,
  FlexItem,
  ComponentsProvider,
  Heading,
  Button,
  Spinner,
  Text,
  theme,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import { useWindowSize, useKeyPress, getConfig } from "../utils/fetchers"
import { covid_country_deaths } from "./covid_country_deaths";
import { july_dist } from "./polls_july";
import { polls_flat } from "./polls_flat";
import { weekly_avg } from "./weekly_avg";
import { scaleLinear, scaleBand } from '@vx/scale';
import { BarChart } from "./BarChart";
import { VizManager } from "./VizManager";
import { Boxplot } from "./Boxplot";
import { XAxis } from "./XAxis";
import { YAxis } from "./YAxis";
import { Title } from "./Title";
import { VizLegend } from "./VizLegend";
import { VizTooltip } from './VizTooltip';

export const Vizzy: React.FC<{}> = () => {
  const isEditing = useKeyPress("Escape");
  const { config, addConfig } = getConfig()

  const plot = useWindowSize();
  const legend_xRatio = 0.10
  const yAxis_xRatio = 0.10
  const CHART_X_RATIO = 1 - legend_xRatio - yAxis_xRatio

  const title_yRatio = 0.1
  const xAxis_yRatio = 0.12
  const CHART_Y_RATIO = 1 - title_yRatio
  const INNER_CHART_Y_RATIO = 1 - xAxis_yRatio - title_yRatio

  const defaults = {
    legend_xRatio: legend_xRatio,
    y_xRatio: yAxis_xRatio,
    CHART_X_RATIO: CHART_X_RATIO,
    title_yRatio: title_yRatio,
    xAxis_yRatio: xAxis_yRatio,
    INNER_CHART_Y_RATIO: INNER_CHART_Y_RATIO,
    CHART_Y_RATIO: CHART_Y_RATIO,
    data_rows: 10,
    data_x: "0",
    data_y: "1",
    x_label: "",
    y_label: "",
    chart_background: "#FFFFF",
    chart_fontColor: "#282828",
    tooltip: {tooltipOn: false}

  }

  function compare( a, b ) {
    let yKey = dimKeys[config.data_x || defaults.data_x]
    if ( a[yKey] < b[yKey] ){
      return -1;
    }
    if ( a[yKey] > b[yKey] ){
      return 1;
    }
    return 0;
  }

  const data_limit = config.data_rows || defaults.data_rows
  let data = weekly_avg.filter((d,i)=>{
    return i<data_limit
  })
  let dimKeys = Object.keys(data[0] || {})

  data = data.sort(compare)

  const x = (d: any) => d[dimKeys[config.data_x || defaults.data_x]];
  const y = (d: any) => d[dimKeys[config.data_y || defaults.data_y]];

  defaults.x_label = dimKeys[config.data_x || defaults.data_x]
  defaults.y_label = dimKeys[config.data_y || defaults.data_y]

  function getChartXRatio() {
    let legend_x = (config.legend_xRatio || defaults.legend_xRatio)
    let yAxis_x = (config.y_xRatio || defaults.y_xRatio)
    const chart_x = 1 - legend_x - yAxis_x
    return chart_x * 100
  }

  function getChartYRatio() {
    let title_y = (config.title_yRatio || defaults.title_yRatio)
    const chart_y = 1 - title_y
    return chart_y * 100
  }

  function getInnerChartYRatio() {
    let xaxis_y = (config.xAxis_yRatio || defaults.xAxis_yRatio)
    let title_y = (config.title_yRatio || defaults.title_yRatio)
    const chart_inner_y = 1 - xaxis_y - title_y
    return chart_inner_y * 100
  }

  const xScale = scaleBand({
    range: [0, plot.width*(getChartXRatio()/100)*0.9],
    domain: data.map(x),
  });

  const yScale = scaleLinear({
    range: [plot.height*(getInnerChartYRatio()/100), 0],
    domain: [0, Math.max(...data.map(y))],
  });

  const compose = (scale: any, accessor: any) => (data: any) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return (
    <ComponentsProvider>
    {config && 
    <>
    <VizManager
      isEditing={isEditing}
      setup={defaults}
      plot={plot}
      config={config}
      setConfig={addConfig}
    />
    <VizTooltip
      config={config}
      isEditing={isEditing}
      setup={defaults}
      data={data}
    >
    <Tile 
      flexDirection="column" 
      height="100%" 
      p="xxxlarge" 
      mr={isEditing && "10%"}
      backgroundColor={config.chart_background || defaults.chart_background}
    >
      <Title
        content="Polling Distributions"
        isEditing={isEditing}
        setup={defaults}
        plot={plot}
        config={config}
        setConfig={addConfig}
      />
      <Flex flexBasis={`${getChartYRatio()}%`}>
        <YAxis
            yScale={yScale}
            isEditing={isEditing}
            setup={defaults}
            plot={plot}
            config={config}
            setConfig={addConfig}
        />
        <Flex flexDirection="column" flexBasis={`${getChartXRatio()}%`}>
          <BarChart
            data={data}
            xPoint={xPoint}
            yPoint={yPoint}
            xScale={xScale}
            isEditing={isEditing}
            setup={defaults}
            plot={plot}
            config={config}
            setConfig={addConfig}
          />
          <XAxis
            xScale={xScale}
            isEditing={isEditing}
            setup={defaults}
            plot={plot}
            config={config}
            setConfig={addConfig}
          />
        </Flex>
        <VizLegend 
          isEditing={isEditing}
          data={data}
          setup={defaults}
          plot={plot}
          config={config}
          setConfig={addConfig}
        />
      </Flex>
    </Tile>
    </VizTooltip>
    </>}
    </ComponentsProvider>
  );
}

// @ts-ignore
const Tile = styled(Flex)`
  padding: 5px;
  .EDIT_MODE {
    border-radius: 5px;
    box-shadow: 0px 0px 0px 1px ${theme.colors.key} inset;
  }
  .EDIT_MODE:hover {
    margin: 0.5%;
    box-shadow: 0px 0px 0px 3px ${theme.colors.key} inset;
  }
`;
