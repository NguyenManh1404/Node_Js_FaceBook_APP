import React from 'react'
import { Box } from '@admin-bro/design-system'

const UserImage = (props) => {
   
    return (<>
        <Box>
            <div style={{ width: "100%" }}>
                <img src={`${props?.record?.params?.avatar?.replace('\\public','/public')}`}  style={{ height: 100, width: 100, borderRadius: "50%", margin: 'auto' }} alt="" />
            </div>
        </Box>
    </>
    )
}

export default UserImage