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
import { Property } from 'csstype'
import {
  FlexItem,
  Select,
  Text,
  Paragraph,
  InlineInputText,
  InlineTextArea,
  Space,
  Popover,
  PopoverContent,
} from "@looker/components";
import styled from "styled-components";

export const Title: React.FC<{
  content: string,
  isEditing: boolean,
  setup: any,
  plot: any,
  config: any,
  setConfig: (config: any) => void,
}> = ({ content, isEditing, setup, plot, config, setConfig }) => {

  const defaults = {
    fontSize: "large",
    position: "center",
    description: "",
    descFontSize: "xsmall",
  }

  const configCard = isEditing && (
    <PopoverContent p="small" width="300px" height="auto">
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Title Position</Text>
        <Select 
          defaultValue={config.position || defaults.position} 
          options={[
            { value: 'left', label: 'left' },
            { value: 'center', label: 'center' },
            { value: 'right', label: 'right' },
          ]}
          onChange={(e)=>{setConfig({...config, position: e})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Title Override</Text>
        <InlineInputText 
          value={config.title || content} 
          onChange={(e)=>{setConfig({...config, title: e.currentTarget.value})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Title Font Size</Text>
        <Select 
          defaultValue={config.fontSize || defaults.fontSize} 
          options={[
            { value: 'small', label: 'small' },
            { value: 'medium', label: 'medium' },
            { value: 'large', label: 'large' },
            { value: 'xlarge', label: 'larger' },
            { value: 'xxlarge', label: 'largest' },
          ]}
          onChange={(e)=>{setConfig({...config, fontSize: e})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Description</Text>
        <InlineTextArea 
          value={config.description || defaults.description} 
          onChange={(e)=>{setConfig({...config, description: e.currentTarget.value})}}
        />
      </Space>
      <Space mb="small">
        <Text fontSize="xxsmall" variant="subdued">Description Font Size</Text>
        <Select 
          defaultValue={config.descFontSize || defaults.descFontSize} 
          options={[
            { value: 'xxsmall', label: 'smallest' },
            { value: 'xsmall', label: 'smaller' },
            { value: 'small', label: 'small' },
          ]}
          onChange={(e)=>{setConfig({...config, descFontSize: e})}}
        />
      </Space>
    </PopoverContent>
  )

  return (
    <>
    <Popover content={configCard} placement="bottom-start">
      <TitleWrapper 
        flexBasis={`${config.TITLE_Y_RATIO || setup.TITLE_Y_RATIO*100}%`} 
        width="100%"
        textAlign={config.position || defaults.position}
        className={isEditing && "EDIT_MODE"}
      >
        <Text
          pt="small"
          pl="small" 
          pr="small" 
          fontSize={config.fontSize || defaults.fontSize}
        >
          {config.title || content}
        </Text>
        <Paragraph 
          pl="small" 
          pr="small"
          fontSize={config.descFontSize || defaults.descFontSize} 
          variant="subdued"
        >
          {config.description}
        </Paragraph>
      </TitleWrapper>
    </Popover>
    </>
  );
}

// @ts-ignore
const TitleWrapper = styled(FlexItem)`
`;
