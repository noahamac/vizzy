import React, { useState, useEffect } from "react";
import styled  from "styled-components";
import { TooltipScatter } from "./TooltipScatter"
import { scaleLinear, scaleBand } from '@vx/scale';
import {
    ButtonOutline,
    ToggleSwitch,
    Label,
    ActionList,
    ActionListItem,
    ActionListItemColumn,
    ActionListItemAction 
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
        console.log(newTooltip)
        setConfig({...config, tooltip: newTooltip})
        console.log(config)
    }
    const types = [
        {
            id: "text",
            type: "Text"
        },
        {
            id: "scatter",
            type: "Scatter"
        },
        {
            id: "box_plot",
            type: "Box Plot"
        }
    ]

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
            < br/>< br/>
            <ActionList columns={[{id: "id", primaryKey: true, title:"Type"}]}>
                {types.map((e) => {
                    return (
                        <ActionListItem
                            key={e.id}
                            id={e.id}
                            actions={
                                <>
                                <ActionListItemAction 
                                    onClick={() => updateTooltip('type', e.id)}
                                >
                                    Select Type
                                </ActionListItemAction>
                                </>
                            }
                        >
                            <ActionListItemColumn>{e.type}</ActionListItemColumn>
                        </ActionListItem>

                    )
                })} 

                
              
            </ActionList>
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
    const [showTooltip, setShowTooltip] = useState({show: false, datum: {}, id:null})
    const height = config.tooltip.type === "text" ? 100 : 300;
    const width = 300;
    const TooltipTarget = styled.div`
        position: absolute;
        left: ${position.x+15}px
        top: ${position.y-(height/2)}px
        background-color: rgb(38, 45, 51);
        box-shadow: rgba(0, 0, 0, 0.12) 0px 3px 18px, rgba(0, 0, 0, 0.04) 0px 1px 4px;
        width: ${width}px;
        height: ${height}px;
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
 
    const TooltipTextContent = styled.div`
        color: rgb(255, 255, 255);
        white-space:pre-wrap;
        font-size: 12px;
        display: block;
    `

    const setFromEvent = (e) => { 
        setPosition({ x: e.clientX, y: e.clientY }); 
        setShowTooltip({ show: false, datum: {}, id: null });
        if(e.target.id){
            console.log(e.target.id)
            setShowTooltip({ show: true, datum: data[e.target.id], id: e.target.id })
        }
    }

    if(showTooltip.show){
        if(config.tooltip.type === 'scatter'){ 
            return (
                <div onMouseMove={(e) => setFromEvent(e)}>
                    <TooltipTarget>
                        <TooltipScatter 
                            data={data}
                            height={height}
                            width={width}
                            id={showTooltip.id}
                            fieldX={"Polls Trump Avg"}
                            fieldY={"Polls Biden Avg"}
                        />
                    </TooltipTarget>
                    { children }
                </div>
            )
        } else if(config.tooltip.type === 'box_plot') {
            return(<></>)
        } else {
            return (
                <div onMouseMove={(e) => setFromEvent(e)}>
                    <TooltipTarget>
                        <TooltipTextContent>
                        {JSON.stringify(showTooltip.datum)}
                        </TooltipTextContent>
                    </TooltipTarget>
                    { children }
                </div>
            )
        }
    }
    return (
        <div onMouseMove={(e) => setFromEvent(e)}>
            { children }
        </div>
    )
    
}  