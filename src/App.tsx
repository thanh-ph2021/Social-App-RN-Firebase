import { useEffect, useState } from 'react'
import { GiphyThemePreset, GiphySDK, GiphyDialog } from '@giphy/react-native-sdk'

import Providers from './navigation'
import { appInfos } from './constants'
import SplashScreen from './screens/SplashScreen'

function App() {

  const [isShowSplash, setIsShowSplash] = useState(true)

  useEffect(() => {
    GiphySDK.configure({ apiKey: appInfos.ANDROID_GIPHY_API_KEY })
    GiphyDialog.configure({ theme: GiphyThemePreset.Dark })

    // show splash screen
    const timeout = setTimeout(() => {
      setIsShowSplash(false)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <>
      {isShowSplash ? <SplashScreen /> : <Providers />}
    </>

  );
}

export default App