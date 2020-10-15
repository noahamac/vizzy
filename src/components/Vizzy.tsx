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
import { ECMap } from "./ECMap";
import { ECBar } from "./ECBar";
import { forecast, toplevel } from "./ecv_forecast";
import { state_dists } from "./state_dists";

export const Vizzy: React.FC<{}> = () => {
  const isEditing = useKeyPress("Escape");
  const { config, addConfig } = getConfig()

  const plot = useWindowSize();
  const legend_xRatio = 0.20
  const yAxis_xRatio = 0.0
  const CHART_X_RATIO = 1

  const title_yRatio = 0.1
  const xAxis_yRatio = 0.0
  const CHART_Y_RATIO = 1 - title_yRatio
  const INNER_CHART_Y_RATIO = 1 - xAxis_yRatio - title_yRatio

  const defaults = {
    legend_xRatio: legend_xRatio,
    y_xRatio: yAxis_xRatio,
    CHART_X_RATIO: 1,
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
    tooltip: {tooltipOn: false},
    chart_x_ratio: null,
    legend_model: "Combined",

  }

  // function compare( a, b ) {
  //   let yKey = dimKeys[config.data_x || defaults.data_x]
  //   if ( a[yKey] < b[yKey] ){
  //     return -1;
  //   }
  //   if ( a[yKey] > b[yKey] ){
  //     return 1;
  //   }
  //   return 0;
  // }

  const data_limit = config.data_rows || defaults.data_rows
  // let data = state_dists.filter((d,i)=>{
  //   return i<data_limit
  // })
  let data = forecast
  let ec_toplevel = toplevel

  // const x = (d: any) => d[dimKeys[config.data_x || defaults.data_x]];
  // const y = (d: any) => d[dimKeys[config.data_y || defaults.data_y]];

  // defaults.x_label = dimKeys[config.data_x || defaults.data_x]
  // defaults.y_label = dimKeys[config.data_y || defaults.data_y]

  function getChartXRatio() {
    let legend_x = (config.legend_xRatio || defaults.legend_xRatio)
    const chart_x = 1 - legend_x
    // return chart_x * 100
    return 100
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

  // const xScale = scaleBand({
  //   range: [0, plot.width*(getChartXRatio()/100)*0.85],
  //   domain: data.map(x),
  // });

  // const yScale = scaleLinear({
  //   range: [plot.height*(getInnerChartYRatio()/100), 0],
  //   domain: [0, Math.max(...data.map(y))],
  // });

  // const compose = (scale: any, accessor: any) => (data: any) => scale(accessor(data));
  // const xPoint = compose(xScale, x);
  // const yPoint = compose(yScale, y);

  return (
    <ComponentsProvider>
    {config && 
    <>
    {/* <VizManager
      isEditing={isEditing}
      setup={defaults}
      plot={plot}
      config={config}
      setConfig={addConfig}
    /> */}
    {/* <VizTooltip
      config={config}
      isEditing={isEditing}
      setup={defaults}
      data={data}
    > */}
    <Tile 
      flexDirection="column" 
      height="auto" 
      p="xxxlarge" 
      backgroundColor={config.chart_background || defaults.chart_background}
    >
      {/* <Title
        content="Polling Distributions"
        isEditing={isEditing}
        setup={defaults}
        plot={plot}
        config={config}
        setConfig={addConfig}
      /> */}
      <Flex flexBasis={`auto`}>
        <Flex flexDirection="column" flexBasis={`${getChartXRatio()}%`} mb="medium">
          <ECBar
            top={ec_toplevel}
            isEditing={isEditing}
            setup={defaults}
            plot={plot}
            config={config}
            setConfig={addConfig}
          />
          <ECMap
            data={data}
            isEditing={isEditing}
            setup={defaults}
            plot={plot}
            config={config}
            setConfig={addConfig}
          />
        </Flex>
        {/* <VizLegend 
          isEditing={isEditing}
          data={data}
          setup={defaults}
          plot={plot}
          config={config}
          setConfig={addConfig}
        /> */}
      </Flex>
    </Tile>
    <Flex style={{maxWidth:800, margin: "0 auto"}} p="medium" flexDirection={"column"}>
      <FlexItem><Text fontSize="small" variant="subdued">Sources: <a target="_blank" href={"https://data.fivethirtyeight.com/"}>FiveThirtyEight</a>, <a target="_blank" href={"https://web.archive.org/web/20200916023711/https://www.niskanencenter.org/bitecofer-epstein-september-update/"}>Dr. Rachel Bitecofer and Sam Epstein</a></Text></FlexItem>
      <FlexItem><Heading>How to read:</Heading></FlexItem>
      <FlexItem mb="xsmall"><Text>{`This model predicts that Joe Biden (D) wins the presidency with ${ec_toplevel[0].solid_biden + ec_toplevel[0].lean_biden} Electoral votes. Joe Biden will win as few as ${ec_toplevel[0].solid_biden} and as many as ${ec_toplevel[0].solid_biden+ec_toplevel[0].lean_biden+ec_toplevel[0].lean_trump+ec_toplevel[0].tossup} Electoral votes.`}</Text></FlexItem>
      <FlexItem mb="xsmall"><Text>{`Joe Biden definitely wins ${data.filter((d)=>{return d["Forecast Lookup Forecast"] === "Solid Biden"}).map((d)=>{return " " + d["Ecmap Abbreviation"]})}.`}</Text></FlexItem>
      <FlexItem mb="xsmall"><Text>{`Joe Biden probably wins ${data.filter((d)=>{return d["Forecast Lookup Forecast"] === "Lean Biden"}).map((d)=>{return " " + d["Ecmap Abbreviation"]})}. `}</Text></FlexItem>
      <FlexItem mb="xsmall"><Text>{`Donald Trump (R) definitely wins ${data.filter((d)=>{return d["Forecast Lookup Forecast"] === "Solid Trump"}).map((d)=>{return " " + d["Ecmap Abbreviation"]})}. `}</Text></FlexItem>
      <FlexItem mb="xsmall"><Text>{`Donald Trump probably wins ${data.filter((d)=>{return d["Forecast Lookup Forecast"] === "Lean Trump"}).map((d)=>{return " " + d["Ecmap Abbreviation"]})}. `}</Text></FlexItem>
      {/* <FlexItem mb="xsmall"><Text>{`This model works by taking Dr. Rachel Bitecofer's research and model to the extreme: America is so polarized, and public opinion so stable over the long run, that we can use the marginal outcome of every general election poll collected by 538 as a probability distribution of electoral outcomes in November. This model states emphatically that nothing has changed the race, because nothing can change American's minds about the race. States are organized into calls of Solid Biden, Lean Biden, Tossup, Lean Trump, or Solid Trump based on the distribution of marginal outcomes. While the model argues there is no time-series dimension to the 2020 outcome, it remains as a manipulated variable for your consideration.`}</Text></FlexItem> */}
      {/* <FlexItem><Heading>Methodology:</Heading></FlexItem>
      <FlexItem><Text>{`This model extends Dr. Rachel Bitecofer's negative partisanship / realignment theory and model to include general election polling between Donald Trump (R) and Joe Biden (D). Without going into the specifics of her theory, as her work stands for itself and should be considered separate, as a result of extreme negative polarization, public opinion in the US does not change and reflects generational and demographic shifts and specifically how they perceive their opposition. Her theory could be reduced to say: nobody has changed their mind about their 2020 vote preference, and nobody will. An election every day for the past 4 years would produce the same outcome as will occur on November 3, 2020. This polling model methodology takes this assertion to the extreme: every general election poll conducted during the Trump presidency is converted into the net Biden margin of victory (biden_pct - trump_pct).`}</Text></FlexItem> */}
    </Flex>
    {/* </VizTooltip> */}
    </>}
    </ComponentsProvider>
  );
}

// @ts-ignore
const Tile = styled(Flex)`
  padding: 10px;
  max-width: 800px;
  margin: 0 auto;
  .EDIT_MODE {
    border-radius: 5px;
    box-shadow: 0px 0px 0px 1px ${theme.colors.key} inset;
  }
  .EDIT_MODE:hover {
    margin: 0.5%;
    box-shadow: 0px 0px 0px 3px ${theme.colors.key} inset;
  }
`;
