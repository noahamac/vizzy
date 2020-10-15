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

export const SolidBidenGauge: React.FC<{
}> = () => {

  return (
    <div className="viz" style={{overflow: "hidden", position: "fixed", width: "120px"}}><svg width="1440" height="732" id="svg-viz" className="gauge" preserveAspectRatio="xMidYMid meet" viewBox="-720 -366 1440 732"><g id="g-viz" transform="scale(1.5858206902731298)translate(0 84.9119873046875)"><path className="gauge_background" d="M-292.8,-3.58576582790345e-14A292.8,292.8,0,1,1,292.8,0L158.11200000000002,0A158.11200000000002,158.11200000000002,0,1,0,-158.11200000000002,-1.9363135470678633e-14Z" fill="#CECECE" stroke="none"></path><path className="gaugeFill-0" d="M-292.8,-3.58576582790345e-14A292.8,292.8,0,0,1,-236.8801759529846,-172.10352187123618L-127.91529501461169,-92.93590181046754A158.11200000000002,158.11200000000002,0,0,0,-158.11200000000002,-1.9363135470678633e-14Z" fill="#00B8F5" stroke="#00B8F5" stroke-width="1px"></path><path className="gaugeFill-1" d="M-236.8801759529846,-172.10352187123618A292.8,292.8,0,0,1,-90.48017595298458,-278.469347971221L-48.85929501461168,-150.37344790445937A158.11200000000002,158.11200000000002,0,0,0,-127.91529501461169,-92.93590181046754Z" fill="#47D1FF" stroke="#47D1FF" stroke-width="1px"></path><path className="gaugeFill-2" d="M-90.48017595298458,-278.469347971221A292.8,292.8,0,0,1,90.48017595298462,-278.46934797122094L48.859295014611696,-150.37344790445934A158.11200000000002,158.11200000000002,0,0,0,-48.85929501461168,-150.37344790445937Z" fill="#7A55E3" stroke="#7A55E3" stroke-width="1px"></path><path className="gaugeFill-3" d="M90.48017595298462,-278.46934797122094A292.8,292.8,0,0,1,236.88017595298462,-172.10352187123615L127.91529501461171,-92.93590181046753A158.11200000000002,158.11200000000002,0,0,0,48.859295014611696,-150.37344790445934Z" fill="#FF9999" stroke="#FF9999" stroke-width="1px"></path><path className="gaugeFill-4" d="M236.88017595298462,-172.10352187123615A292.8,292.8,0,0,1,292.8,0L158.11200000000002,0A158.11200000000002,158.11200000000002,0,0,0,127.91529501461171,-92.93590181046753Z" fill="#FF6B6B" stroke="#FF6B6B" stroke-width="1px"></path><path className="leftArmArc" d="M-304.3,-3.726600209805396e-14L-153.36864000000003,-1.8782241406558274e-14Z" fill="#CECECE" stroke="#CECECE" stroke-width="0"></path><text className="minLabel" dx="--0.3em" dy="-1em" transform="translate(-304.29998779296875 1.8483759851471368e-14)" style={{fontSize: "0vh", fontFamily: "Arial, Helvetica, sans-serif", fill: "rgb(40, 40, 40)", fontWeight: "bold"}}>0</text><path className="rightArmArc" d="M304.3,0L153.36864000000003,0Z" fill="#CECECE" stroke="#CECECE" stroke-width="0"></path><text className="maxLabel" dx="-1.3em" dy="-1em" transform="translate(304.29998779296875 0)" style={{fontSize: "0vh", fontFamily: "Arial, Helvetica, sans-serif", fill: "rgb(40, 40, 40)", fontWeight: "bold"}}>27</text><path className="spinnerArm" d="M-244.6438179623315,-83.04538591190992L32.222108179482994,21.530124354255246L38.67022642405025,2.534580547681595Z" fill="#282828" stroke="#282828" stroke-width="4.3"></path><circle className="spinnerCenter" r="21.5" style={{stroke: "rgb(206, 206, 206)", fill: "rgb(255, 255, 255)"}}></circle><text className="gaugeValue" transform="translate(0 99.552)" style={{fontSize: "0vh", fontFamily: "Arial, Helvetica, sans-serif", color: "rgb(40, 40, 40)"}}>25</text><text className="gaugeValueLabel" dy="1.2em" transform="translate(0 99.552)" style={{fontSize: "0vh", fontFamily: "Arial, Helvetica, sans-serif", color: "rgb(112, 112, 112)"}}>Min of Forecast Index</text></g></svg></div>
  );
}

// @ts-ignore
const ChartWrapper = styled(FlexItem)`
`;

