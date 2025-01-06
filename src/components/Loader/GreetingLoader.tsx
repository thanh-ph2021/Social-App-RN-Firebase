import ContentLoader, { Rect } from "react-content-loader/native"

import { COLORS, SIZES } from "../../constants"

const GreetingLoader = () => {
    return (
        <ContentLoader
            viewBox={`0 0 150 20`}
            width={150}
            height={20}
            backgroundColor={COLORS.lightGrey}
            foregroundColor={COLORS.darkGrey}
            style={{ marginTop: SIZES.base }}
        >
            <Rect x="0" y="0" rx="4" ry="4" width="150" height="20" />
        </ContentLoader>
    )
}

export default GreetingLoader