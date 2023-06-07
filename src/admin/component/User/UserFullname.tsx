import React from 'react'
import { Box } from '@admin-bro/design-system'

const PostImage = (props) => {
    const params = props?.record?.params
    return (<>
        <Box>
            <p>{params?.firstName} {params?.lastName}</p>
        </Box>
    </>
    )
}

export default PostImage