import React, { useState, useEffect, useContext } from "react"
import { ExtensionContext, ExtensionContextData } from "@looker/extension-sdk-react"
import { Looker31SDK as LookerSDK, Looker31SDK } from '@looker/sdk/lib/sdk/3.1/methods'
import { ILookmlModel, ILookmlModelExplore, IUser } from "@looker/sdk/lib/sdk/4.0/models"

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(keyState => !keyState);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, []);

  return keyPressed;
}

export function getConfig() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK, initializeError } = extensionContext
  const { coreSDK } = useContext(ExtensionContext)
  const [config, setConfig] = React.useState<any>({})

  const addConfig = async (newConfig: any): Promise<void> => {
    setConfig({...newConfig})
    await extensionSDK.saveContextData({...newConfig})
  }

  useEffect(() => {
    const initialize = async () => {
      let config
      config = await extensionSDK.getContextData()
      config && config.stats_views ? config.stats_views = config.stats_views + 1 : config.stats_views = 1
      addConfig(config || {})
    }
    initialize()
  }, [])

  return { config, addConfig }
}
