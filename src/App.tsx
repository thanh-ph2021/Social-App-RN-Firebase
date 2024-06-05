import { useEffect } from 'react';
import Providers from './navigation'
import { appInfos } from './constants';
import { GiphyThemePreset, GiphySDK, GiphyDialog } from '@giphy/react-native-sdk';

function App() {

  useEffect(() => {
    GiphySDK.configure({ apiKey: appInfos.ANDROID_GIPHY_API_KEY })
    GiphyDialog.configure({ theme: GiphyThemePreset.Dark })
  }, [])

  return (
    <Providers />
  );
}

export default App