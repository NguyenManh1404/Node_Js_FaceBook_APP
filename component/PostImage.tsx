import React from 'react'
import { Box } from '@admin-bro/design-system'

const PostImage = (props) => {
    console.log(props);
    return (<>
        <Box><img src={props?.record?.params?.imagePost} style={{ height: 100 }} alt="" /></Box>
    </>
    )
}

export default PostImage