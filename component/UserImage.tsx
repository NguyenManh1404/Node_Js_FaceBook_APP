import React from 'react'
import { Box } from '@admin-bro/design-system'

const UserImage = (props) => {
    return (<>
        <Box><img src={props?.record?.params?.avatar} style={{ height: 100 }} alt="" /></Box>
    </>
    )
}

export default UserImage