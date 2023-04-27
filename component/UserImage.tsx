import React from 'react'
import { Box } from '@admin-bro/design-system'

const UserImage = (props) => {
    return (<>
        <Box>
            <div style={{ width: "100%" }}>
                <img src={props?.record?.params?.avatar} style={{ height: 100, margin: 'auto' }} alt="" />
            </div>
        </Box>
    </>
    )
}

export default UserImage