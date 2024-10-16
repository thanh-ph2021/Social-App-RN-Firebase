import ContentLoader, { Circle, Rect } from "react-content-loader/native"

import { COLORS, SIZES } from "../../constants"

const CommentLoader = () => {
    return (
        <ContentLoader
            viewBox={`0 0 ${SIZES.width} 80`}
            width={SIZES.width}
            height={80}
            backgroundColor={COLORS.lightGrey}
            foregroundColor={COLORS.darkGrey}
            style={{ marginTop: -SIZES.padding }}
        >
            <Circle cx="12" cy="30" r="12.5" />
            <Rect x="35" y="22.5" rx="4" ry="4" width="50" height="15" />
            <Rect x="95" y="22.5" rx="4" ry="4" width="70" height="15" />
            <Rect x="35" y="45" rx="4" ry="4" width={`${SIZES.width * 0.6}`} height="30" />
        </ContentLoader>
    )
}

export default CommentLoader