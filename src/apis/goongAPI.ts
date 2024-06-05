import { appInfos } from "../constants"
import axiosClient from "./axiosClient"


class GoongAPIClass {
    ReverseGeocoding = async (
        latlng: string,
    ) => {
        return await axiosClient.get(`${appInfos.GOONG_API_URL}/Geocode`, {
            params: {
                latlng: latlng,
                api_key: appInfos.GOONG_API_KEY
            }
        })
    }
}

const GoongAPI = new GoongAPIClass()
export default GoongAPI