import ContentLoader, { Circle, Rect } from "react-content-loader/native"

import { COLORS, SIZES } from "../../constants"

const StoryLoader = () => {
    return (
        <ContentLoader
            viewBox={`0 0 ${SIZES.width} 150`}
            width={SIZES.width}
            height={150}
            backgroundColor={COLORS.lightGrey}
            foregroundColor={COLORS.darkGrey}
            style={{ marginTop: SIZES.base }}
        >
            <Rect x="10" y="0" rx="16" ry="16" width="100" height="140" />
            <Rect x="123" y="0" rx="16" ry="16" width="100" height="140" />
            <Rect x="236" y="0" rx="16" ry="16" width="100" height="140" />
            <Rect x="349" y="0" rx="16" ry="16" width="100" height="140" />
        </ContentLoader>
    )
}

export default StoryLoader