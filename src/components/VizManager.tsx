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
  Accordion,
  AccordionContent,
  AccordionDisclosure,
  ButtonOutline,
  ActionList,
  ActionListItemColumn,
  ActionListItem,
  IconButton,
  ActionListColumns,
  ActionListItemAction,
  Card,
  ToggleSwitch,
  Label,
  theme,
} from "@looker/components";
import styled, { ThemeProvider } from "styled-components";
import "./styles.css";
import { covid_country_deaths } from "./covid_country_deaths";
import {  } from "@looker/sdk";
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisLeft } from '@vx/axis';
import { TooltipMenu } from './VizTooltip'
import { Gritty } from './Gritty';
import { Clippy } from './Clippy';

export const VizManager: React.FC<{
  isEditing: boolean,
  setup: any,
  plot: any,
  config: any,
  setConfig: (newConfig: any) => void,
}> = ({ isEditing, setup, plot, config, setConfig, }) => {
  const [action, setAction] = useState("")

  const defaults = {
    viz_manager: "vizzy"
  }

  const see_config_columns: ActionListColumns = [
    {
      id: 'config',
      title: "",
      type: 'string',
    },
  ]

  function getConfigRow(key: string, color: string) {
    let parts = key.split("_")
    let component = parts[0]
    let attribute = parts[1]
    return (
      <Flex>
      <FlexItem flexBasis="30%" width="100">
        <Card raised textAlign="center" height="auto" minWidth="20px">
          {/* @ts-ignore */}
          <Text backgroundColor={color} fontSize="small">
            {component}
          </Text>
        </Card>
      </FlexItem>
      <FlexItem flexBasis="70%"  width="100%">
        <Text fontSize="medium" ml="small">
          {`${attribute}: ${config[key]}`}
        </Text>
      </FlexItem>
      </Flex>)
  }

  function getConfigRowAction(key: string) {
    let copy = {}
    Object.assign(copy, config)
    delete copy[key]
    return (
      <ActionListItemAction onClick={()=>{setConfig({...copy})}}>Delete</ActionListItemAction>
    )
  }

  function getAction(actionType: string) {
    let colors = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#20A39E", "#EF5B5B", "#4F759B", "#32965D", "#C97064"]
    if (actionType === "") {
      return (
        <>
        <ButtonOutline fullWidth onClick={()=>{setAction("see_configuration")}}>Show configurations</ButtonOutline>
        <ButtonOutline fullWidth>Watch something for me</ButtonOutline>
        <ButtonOutline fullWidth>Add a control</ButtonOutline>
        <ButtonOutline fullWidth onClick={()=>{setAction("stats")}}>Show me some stats</ButtonOutline>
        <ButtonOutline fullWidth>Apply styles for me</ButtonOutline>
        <ButtonOutline fullWidth onClick={()=>{setAction("config_tooltip")}}>Configure Tooltip</ButtonOutline>
        <ButtonOutline fullWidth onClick={()=>{setAction("set_styles")}}>Apply styles for me</ButtonOutline>
        </>
      )
    } else if (actionType === "see_configuration") {
      let comps = Object.keys(config).map((d)=>{return d.split("_")[0]})
      let compArr = new Set(comps)
      return (
        <>
        <ButtonOutline fullWidth onClick={()=>{setAction("")}}>Back to Menu</ButtonOutline>
        <ActionList columns={see_config_columns}>
          {
            Object.keys(config).filter((d)=>{return d.split("_")[0] != "data"}).sort().map((d,i) => {
              return (
                <ActionListItem 
                  id={d}
                  actions={getConfigRowAction(d)}
                >
                  <ActionListItemColumn>
                    {getConfigRow(d, colors[Array.from(compArr.values()).indexOf(d.split("_")[0])])}
                  </ActionListItemColumn>
                </ActionListItem>
              )
            })
          }
        </ActionList>
        </>
      )

    }
    else if (actionType === "stats") {
      return (<>
        <ButtonOutline mb="medium" fullWidth onClick={()=>{setAction("")}}>Back to Menu</ButtonOutline>
        <Text>{config.stats_views} Views</Text>
        </>
      )

    }

    else if (actionType === "config_tooltip") {
        return (<>
          <ButtonOutline mb="medium" fullWidth onClick={()=>{setAction("")}}>Back to Menu</ButtonOutline> 
          <TooltipMenu 
            config={config}
            setup={setup}
            setConfig={setConfig}
          />
        </>
        )
    }
  
    else if (actionType === "set_styles") {
      return (<>
        <ButtonOutline mb="medium" fullWidth onClick={()=>{setAction("")}}>Back to Menu</ButtonOutline>
        <Button mb="medium" fullWidth 
          onClick={()=>{
            setConfig({
              ...config, 
              chart_background: "#FFFFFF",
              chart_fontColor: "#282828",
            })
          }}>Lights On</Button>
        <Button mb="medium" fullWidth 
          onClick={()=>{
            setConfig({
              ...config, 
              chart_background: "#282828",
              chart_fontColor: "#FFFFFF",
            })
          }}>Lights Off</Button>
        <Button mb="medium" fullWidth 
        onClick={()=>{
          setConfig({
            ...config, 
            viz_manager: "vizzy",
          })
        }}>Use Vizzy</Button>
        <Button mb="medium" fullWidth 
        onClick={()=>{
          setConfig({
            ...config, 
            viz_manager: "clippy",
          })
        }}>Use Clippy</Button>
        <Button mb="medium" fullWidth 
          onClick={()=>{
            setConfig({
              ...config, 
              viz_manager: "gritty",
              chart_background: "#c73b02",
            })
          }}>Use Gritty</Button>
      </>
      )

    }
  }

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="200px">
      {getAction(action)}
    </PopoverContent>
  )

  function getSvg(manager: string) {
    if (manager === "vizzy") {
      return <svg version="1.1" viewBox="0.0 0.0 288.0 384.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10"><clipPath id="p.0"><path d="m0 0l288.0 0l0 384.0l-288.0 0l0 -384.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l288.0 0l0 384.0l-288.0 0z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m142.79845 60.856956c-2.4693756 9.012245 -13.951874 33.456253 -14.816269 54.073486c-0.86439514 20.61724 13.333328 42.839897 9.629913 69.62992c-3.7033997 26.790024 -42.838135 79.999115 -31.850388 91.11023c10.987755 11.1111145 75.06125 -21.356949 97.7769 -24.443558c22.715668 -3.086609 32.59099 1.4794312 38.51706 5.923874c5.926071 4.444458 7.286087 11.6067505 -2.9606323 20.742798c-10.246719 9.136047 -48.643036 24.690735 -58.519684 34.073486c-9.876633 9.382751 -0.6167908 18.519257 -0.7401581 22.223083" fill-rule="evenodd"/><path stroke="#4285f4" stroke-width="24.0" stroke-linejoin="round" stroke-linecap="butt" d="m142.79845 60.856956c-2.4693756 9.012245 -13.951874 33.456253 -14.816269 54.073486c-0.86439514 20.61724 13.333328 42.839897 9.629913 69.62992c-3.7033997 26.790024 -42.838135 79.999115 -31.850388 91.11023c10.987755 11.1111145 75.06125 -21.356949 97.7769 -24.443558c22.715668 -3.086609 32.59099 1.4794312 38.51706 5.923874c5.926071 4.444458 7.286087 11.6067505 -2.9606323 20.742798c-10.246719 9.136047 -48.643036 24.690735 -58.519684 34.073486c-9.876633 9.382751 -0.6167908 18.519257 -0.7401581 22.223083" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m168.7231 174.33989l0 0c0 -29.658127 16.301071 -53.700783 36.409454 -53.700783l0 0c9.656372 0 18.917267 5.6577454 25.745361 15.7286c6.8280945 10.070847 10.664078 23.729858 10.664078 37.972183l0 0c0 29.658127 -16.301056 53.70079 -36.40944 53.70079l0 0c-20.108383 0 -36.409454 -24.042664 -36.409454 -53.70079z" fill-rule="evenodd"/><path stroke="#f4b400" stroke-width="12.0" stroke-linejoin="round" stroke-linecap="butt" d="m168.7231 174.33989l0 0c0 -29.658127 16.301071 -53.700783 36.409454 -53.700783l0 0c9.656372 0 18.917267 5.6577454 25.745361 15.7286c6.8280945 10.070847 10.664078 23.729858 10.664078 37.972183l0 0c0 29.658127 -16.301056 53.70079 -36.40944 53.70079l0 0c-20.108383 0 -36.409454 -24.042664 -36.409454 -53.70079z" fill-rule="evenodd"/><path fill="#db4437" d="m191.11679 197.52362l0 0c0 -7.740677 6.27507 -14.015747 14.015762 -14.015747l0 0c3.7171936 0 7.2821655 1.476654 9.910629 4.105118c2.6284637 2.6284637 4.105118 6.1934204 4.105118 9.910629l0 0c0 7.740692 -6.27507 14.015747 -14.015747 14.015747l0 0c-7.740692 0 -14.015762 -6.275055 -14.015762 -14.015747z" fill-rule="evenodd"/><path fill="#f4b400" d="m65.043304 151.38715l0 0c0 -12.237244 9.75808 -22.157486 21.79528 -22.157486l0 0c5.780464 0 11.324181 2.3344421 15.411583 6.4897766c4.08741 4.1553345 6.38369 9.791168 6.38369 15.667709l0 0c0 12.237228 -9.75808 22.15747 -21.795273 22.15747l0 0c-12.037201 0 -21.79528 -9.920242 -21.79528 -22.15747z" fill-rule="evenodd"/><path fill="#4285f4" d="m190.9462 334.9305c9.012253 -7.901123 53.950134 -41.727905 54.073486 -47.40683c0.12336731 -5.678894 -41.852142 7.284363 -53.33333 13.3333435c-11.481201 6.0489807 -12.961502 19.13385 -15.5538025 22.960632" fill-rule="evenodd"/><path fill="#4285f4" d="m131.71129 57.134083c3.8711548 -3.33955 14.274994 -19.636375 23.226974 -20.037312c8.951981 -0.4009323 33.38861 4.673481 30.484924 17.631699c-2.9037018 12.958221 -39.922577 50.098015 -47.90709 60.117615" fill-rule="evenodd"/><path fill="#4285f4" d="m166.5 333.4475c1.8521423 2.222229 6.2978973 13.950562 11.112854 13.3333435c4.814972 -0.61724854 14.814087 -14.197296 17.776917 -17.036774" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m41.25853 152.63911c0 -10.43689 8.460762 -18.897644 18.897636 -18.897644l9.076653 0c10.436874 0 18.897636 -8.460762 18.897636 -18.897636l0 0c0 10.436874 8.460762 18.897636 18.897636 18.897636l34.797363 0l0 0c10.436874 0 18.897644 8.460754 18.897644 18.897644z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m41.25853 152.63911c0 -10.43689 8.460762 -18.897644 18.897636 -18.897644l9.076653 0c10.436874 0 18.897636 -8.460762 18.897636 -18.897636l0 0c0 10.436874 8.460762 18.897636 18.897636 18.897636l34.797363 0l0 0c10.436874 0 18.897644 8.460754 18.897644 18.897644" fill-rule="evenodd"/><path stroke="#0f9d58" stroke-width="12.0" stroke-linejoin="round" stroke-linecap="butt" d="m41.25853 152.63911c0 -10.43689 8.460762 -18.897644 18.897636 -18.897644l9.076653 0c10.436874 0 18.897636 -8.460762 18.897636 -18.897636l0 0c0 10.436874 8.460762 18.897636 18.897636 18.897636l34.797363 0l0 0c10.436874 0 18.897644 8.460754 18.897644 18.897644" fill-rule="evenodd"/></g></svg>
    } else if (manager === "gritty") {
      return <Gritty/>
    } else if (manager === "clippy") {
      return <Clippy/>
    }
  }

  return isEditing && (
    <Popover content={configCard} placement="left-end" pin={true} arrow={true} focusTrap={false}>
    <ManagerWrapper>
      {getSvg(config.viz_manager || defaults.viz_manager)}
    </ManagerWrapper>
    </Popover>
  );
}

// @ts-ignore
const ManagerWrapper = styled.div`
  position: absolute;
  height: 10%;
  width: 10%;
  right: 1vw;
  bottom: 12%;
`;
