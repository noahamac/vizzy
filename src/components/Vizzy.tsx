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
  Chip,
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
import "./styles.css";
import { useWindowSize, useKeyPress, getConfig } from "../utils/fetchers"
import {  } from "./interfaces";
import { covid_country_deaths } from "./covid_country_deaths";
import { july_dist } from "./polls_july";
import { polls_flat } from "./polls_flat";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { BarChart } from "./BarChart";
import { Boxplot } from "./Boxplot";
import { XAxis } from "./XAxis";
import { YAxis } from "./YAxis";
import { Title } from "./Title";
import { VizLegend } from "./VizLegend";

function getBarChart(defaults: any, config: any, plot: any) {
  let data = covid_country_deaths.filter((d,i)=>{return i<10})

  const x = (d: any) => d["Country"];
  const y = (d: any) => d["Deaths (Running Total)"];

  const xScale = scaleBand({
    range: [0, plot.width*(config.CHART_X_RATIO || defaults.CHART_X_RATIO)],
    domain: data.map(x),
  });

  const yScale = scaleLinear({
    range: [plot.height*(config.CHART_Y_RATIO || defaults.CHART_Y_RATIO), 0],
    domain: [0, Math.max(...data.map(y))],
  });

  const compose = (scale: any, accessor: any) => (data: any) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return { data, x, y, xScale, yScale, xPoint, yPoint }
}

function getBoxplot(plot:any, CHART_X_RATIO: number, CHART_Y_RATIO: number) {
  let data = july_dist

  const x = (d: any) => d.boxPlot.x;
  const min = (d: any) => d.boxPlot.min;
  const max = (d: any) => d.boxPlot.max;
  const median = (d: any) => d.boxPlot.median;
  const firstQuartile = (d: any) => d.boxPlot.firstQuartile;
  const thirdQuartile = (d: any) => d.boxPlot.thirdQuartile;
  const outliers = (d: any) => d.boxPlot.outliers;

  const xMax = plot.width;
  const yMax = plot.height;

  const xScale = scaleBand<string>({
    rangeRound: [0, plot.width*CHART_X_RATIO],
    domain: data.map(x),
  });

  const values = data.reduce((allValues, { boxPlot }) => {
    allValues.push(boxPlot.min, boxPlot.max);
    return allValues;
  }, [] as number[]);
  const minYValue = Math.min(...values);
  const maxYValue = Math.max(...values);

  const yScale = scaleLinear<number>({
    rangeRound: [plot.height*CHART_Y_RATIO, 0],
    domain: [minYValue-5, maxYValue],
  });

  const boxWidth = xScale.bandwidth();

  return { xScale, yScale, data, boxWidth, x }
}

function getScatter(config: any) {
  let data = covid_country_deaths.filter((d,i)=>{return i<10})

  const x = (d: any) => d["Country"];
  const y = (d: any) => d["Deaths (Running Total)"];

  const xScale = scaleBand({
    range: [0, config.width*config.CHART_X_RATIO],
    domain: data.map(x),
  });

  const xTickFormat = (v: number) => v

  const yScale = scaleLinear({
    range: [config.height*config.CHART_Y_RATIO, 0],
    domain: [0, Math.max(...data.map(y))],
  });

  const compose = (scale: any, accessor: any) => (data: any) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return { data, x, y, xScale, yScale, compose, xPoint, yPoint, xTickFormat }
}

export const Vizzy: React.FC<{}> = () => {
  const isEditing = useKeyPress("Escape");
  const { config, addConfig } = getConfig()

  const plot = useWindowSize();
  const LEGEND_X_RATIO = 0.1
  const YAXIS_X_RATIO = 0.1
  const CHART_X_RATIO = 1 - LEGEND_X_RATIO - YAXIS_X_RATIO

  const TITLE_Y_RATIO = 0.1
  const XAXIS_Y_RATIO = 0.1
  const INNER_CHART_Y_RATIO = 1 - XAXIS_Y_RATIO
  const CHART_Y_RATIO = 1 - XAXIS_Y_RATIO - TITLE_Y_RATIO

  const defaults = {
    LEGEND_X_RATIO: LEGEND_X_RATIO,
    YAXIS_X_RATIO: YAXIS_X_RATIO,
    CHART_X_RATIO: CHART_X_RATIO,
    TITLE_Y_RATIO: TITLE_Y_RATIO,
    XAXIS_Y_RATIO: XAXIS_Y_RATIO,
    INNER_CHART_Y_RATIO: INNER_CHART_Y_RATIO,
    CHART_Y_RATIO: CHART_Y_RATIO,
  }

  const { data, x, y, xScale, yScale, xPoint, yPoint } = getBarChart(defaults, config, plot)
  // const { xScale, yScale, data, boxWidth, x } = getBoxplot(plot, CHART_X_RATIO, CHART_Y_RATIO)

  console.log(config)

  return (
    <ComponentsProvider>
    {config && <Tile flexDirection="column" height="100%" p="xxxlarge">
      <Title
        content="Polling Distributions"
        isEditing={isEditing}
        setup={defaults}
        plot={plot}
        config={config}
        setConfig={addConfig}
      />
      <Flex flexBasis="90%">
        <YAxis
            yScale={yScale}
            isEditing={isEditing}
            setup={defaults}
            plot={plot}
            config={config}
            setConfig={addConfig}
        />
        <Flex flexDirection="column" flexBasis={`${config.CHART_X_RATIO || defaults.CHART_X_RATIO * 100}%`}>
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
          {/* <Boxplot
            data={data}
            xScale={xScale}
            yScale={yScale}
            boxWidth={boxWidth}
            plot={plot}
            pHeight={INNER_CHART_Y_RATIO}
            isEditing={isEditing}
          /> */}
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
          setup={defaults}
          plot={plot}
          config={config}
          setConfig={addConfig}
        />
      </Flex>
    </Tile>}
    </ComponentsProvider>
  );
}

// @ts-ignore
const Tile = styled(Flex)`
  padding: 5px;
  .EDIT_MODE {
    border-radius: 5px;
    box-shadow: 0px 0px 0px 1px #4285F4 inset;
  }
  .EDIT_MODE:hover {
    margin: 0.5%;
    box-shadow: 0px 0px 0px 3px #4285F4 inset;
  }
`;
