import React from 'react'
import { Box } from '@admin-bro/design-system'

const RecipeImage = (props) => {
    const url = props?.record?.params?.imagePost
    return (<>
        <Box>
            <div style={{ width: 200, textAlign: 'center' }}>
                <img src={url} style={{ height: 100, margin: 'auto' }} alt="" />
            </div>
        </Box>
    </>
    )
}

export default RecipeImage