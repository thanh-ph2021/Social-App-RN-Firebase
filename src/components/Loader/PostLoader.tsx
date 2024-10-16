import ContentLoader, { Circle, Rect } from "react-content-loader/native"

import { COLORS, SIZES } from "../../constants"

const PostLoader = () => {
    return (
        <ContentLoader
            viewBox={`0 0 ${SIZES.width} 300`}
            width={SIZES.width}
            height={300}
            backgroundColor={COLORS.lightGrey}
            foregroundColor={COLORS.darkGrey}
            style={{ marginTop: SIZES.base }}
        >
            <Circle cx="30" cy="30" r="17.5" />
            <Rect x="60" y="10" rx="4" ry="4" width="100" height="15" />
            <Rect x="60" y="35" rx="3" ry="3" width="60" height="15" />
            <Rect x="15" y="70" rx="3" ry="3" width={`${SIZES.width - 30}`} height="15" />
            <Rect x="15" y="95" rx="3" ry="3" width={`${SIZES.width - 30}`} height="200" />
        </ContentLoader>
    )
}

export default PostLoader