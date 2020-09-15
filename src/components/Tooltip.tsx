import React, { useState, useEffect } from "react";
import styled  from "styled-components";
import { Scatter } from "./Scatter"
import { scaleLinear, scaleBand } from '@vx/scale';
import {
    ButtonOutline,
    ToggleSwitch,
    Label,
    Tooltip
  } from "@looker/components";

export const TooltipMenu: React.FC<{
    config: any,
    setup: any,
    setConfig: (newConfig: any) => void
}> = ({ config, setup, setConfig }) => {

    const toggle = config?.tooltip?.tooltipOn || setup.tooltip.tooltipOn
    const toggleTooltip = (e) => setConfig({...config, tooltip: {...config.tooltip, tooltipOn: e.target.checked} })
    const updateTooltip = (attr: string, value: any) => {
        const newTooltip = Object.assign({}, config.tooltip);
        newTooltip[attr] = value;
        setConfig({...config, tooltip: newTooltip})
    }

    if(!toggle){
        return(
            <Label htmlFor="switch"> 
                Toggle Tooltip <ToggleSwitch onChange={toggleTooltip} on={toggle} id="switch" />
            </Label>
        )
    } 
    return(
        <>
            <Label htmlFor="switch"> 
                Toggle Tooltip <ToggleSwitch onChange={toggleTooltip} on={toggle} id="switch" />
            </Label>
            <ButtonOutline mb="medium" fullWidth onClick={()=>{updateTooltip("test", "Dimension")}}>Test</ButtonOutline>
        </>
    )
}

export const VizTooltip: React.FC<{
    config: any,
    isEditing: boolean,
    setup: any,
    data: any,
    chart?: any,
}> = ({config, isEditing, setup, data, chart, children}) => {

    if(isEditing || !(config?.tooltip?.tooltipOn || setup.tooltip.tooltipOn)){
        return(<>{ children }</>)
    }

    const [position, setPosition] = useState({x: Math.random(), y: Math.random()})
    const [showTooltip, setShowTooltip] = useState({show: false, datum: {}})
    const TooltipTarget = styled.div`
        position: absolute;
        left: ${position.x+20}px
        top: ${position.y-250}px
        background-color: rgb(38, 45, 51);
        box-shadow: rgba(0, 0, 0, 0.12) 0px 3px 18px, rgba(0, 0, 0, 0.04) 0px 1px 4px;
        width: 400px;
        height: 400px;
        justify-content: center;
        border-radius: 6px;
        ::after {
            content: "";
            position: absolute;
            top: 50%;
            right: 100%;
            margin-top: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: transparent #555 transparent transparent;
        };
    `
 
    const TooltipContent = styled.div`
        color: rgb(255, 255, 255);
        white-space:pre-wrap;
    `
    const setFromEvent = (e) => { 
        console.log(e)
        setPosition({ x: e.clientX, y: e.clientY }); 
        setShowTooltip({ show: false, datum: {} });
        if(e.target.id){
            setShowTooltip({ show: true, datum: data[e.target.id] })
        }
    }
    console.log(chart)

    if(showTooltip.show){
        return (
            <div onMouseMove={(e) => setFromEvent(e)}>
                <TooltipTarget>
                    <Scatter {...chart}/>
                    {/* <TooltipContent>
                        {JSON.stringify(showTooltip.datum)}
                    </TooltipContent> */}
                </TooltipTarget>
                    { children }
            </div>
        )
    }
    return (
    <div onMouseMove={(e) => setFromEvent(e)}>
        { children }
    </div>)
    
}  