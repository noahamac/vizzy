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
  Heading,
  Button,
  Spinner,
  Text,
  theme,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import {  } from "../utils/routes"
import {  } from "./interfaces";
import { covid_country_deaths } from "./covid_country_deaths";
import { july_dist } from "./polls_july";
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

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

function getBarChart(plot: any, CHART_X_RATIO: number, CHART_Y_RATIO: number) {
  let data = july_dist

  const x = (d: any) => d["Country"];
  const y = (d: any) => d["Deaths (Running Total)"];

  const xScale = scaleBand({
    range: [0, plot.width*CHART_X_RATIO],
    domain: data.map(x),
  });

  const xTickFormat = (v: number) => v

  const yScale = scaleLinear({
    range: [plot.height*CHART_Y_RATIO, 0],
    domain: [0, Math.max(...data.map(y))],
  });

  const compose = (scale: any, accessor: any) => (data: any) => scale(accessor(data));
  const xPoint = compose(xScale, x);
  const yPoint = compose(yScale, y);

  return { data, x, y, xScale, yScale, compose, xPoint, yPoint, xTickFormat }
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

  interface TooltipData {
    name?: string;
    min?: number;
    median?: number;
    max?: number;
    firstQuartile?: number;
    thirdQuartile?: number;
  }
  
  type StatsPlotProps = {
    width: number;
    height: number;
  };

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

export const Vizzy: React.FC<{}> = () => {
  const plot = useWindowSize();
  const LEGEND_X_RATIO = 0.1
  const YAXIS_X_RATIO = 0.1
  const CHART_X_RATIO = 1 - LEGEND_X_RATIO - YAXIS_X_RATIO

  const TITLE_Y_RATIO = 0.1
  const XAXIS_Y_RATIO = 0.1
  const INNER_CHART_Y_RATIO = 1 - XAXIS_Y_RATIO
  const CHART_Y_RATIO = 1 - XAXIS_Y_RATIO - TITLE_Y_RATIO

  // const { data, x, y, xScale, yScale, compose, xPoint, yPoint, xTickFormat } = getBarChart(plot, CHART_X_RATIO, CHART_Y_RATIO)
  const { xScale, yScale, data, boxWidth, x } = getBoxplot(plot, CHART_X_RATIO, CHART_Y_RATIO)

  return (
    <Tile flexDirection="column" height="100%">
      <Title
        content="Q3 Monthly Polling Distributions"
        pHeight={TITLE_Y_RATIO}
      />
      <Flex flexBasis="90%">
        <YAxis
            label={""}
            yScale={yScale}
            plot={plot}
            pWidth={YAXIS_X_RATIO}
        />
        <Flex flexDirection="column" flexBasis={`${CHART_X_RATIO*100}%`}>
          {/* <BarChart
            data={data}
            xPoint={xPoint}
            yPoint={yPoint}
            xScale={xScale}
            plot={plot}
            pHeight={INNER_CHART_Y_RATIO}
          /> */}
          <Boxplot
            data={data}
            xScale={xScale}
            yScale={yScale}
            boxWidth={boxWidth}
            plot={plot}
            pHeight={INNER_CHART_Y_RATIO}
          />
          <XAxis
            label={""}
            xTickFormat={x}
            xScale={xScale}
            plot={plot}
            pHeight={XAXIS_Y_RATIO}
          />
        </Flex>
        <VizLegend 
          pWidth={LEGEND_X_RATIO}
        />
      </Flex>
    </Tile>
  );
}

// @ts-ignore
const Tile = styled(Flex)`
  padding: 5px;
  .hidden {
    border-radius: 5px;
    box-shadow: 0px 0px 0px 1px #4285F4 inset;
  }
  .hidden:hover {
    margin: 0.5%;
    box-shadow: 0px 0px 0px 3px #4285F4 inset;
  }
`;

// @ts-ignore
const Legend = styled(FlexItem)`
`;

