import React from 'react'
import { Box } from '@admin-bro/design-system'

const RecipeImage = (props) => {
    const image = props?.record?.params["images.0"]
    console.log(props?.record?.params);

    return (<>
        <Box>
            <div style={{ width: "100%" }}>
                <img src={image} style={{ height: 100, width: 100, borderRadius: "5%", margin: 'auto' }} alt="" />
            </div>
        </Box>
    </>
    )
}

export default RecipeImage