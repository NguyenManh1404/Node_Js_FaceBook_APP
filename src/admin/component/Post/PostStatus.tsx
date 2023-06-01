import React from 'react'
import { Box } from '@admin-bro/design-system'
import axios from 'axios';

const PostStatus = (props) => {
    const status = props?.record?.params?.statusPost
    console.log(props);

    const onUpdate = async () => {
        try {
            await axios.put('/api/post/approve/' + props?.record?.params?._id);
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    }
    return (<>
        <Box>
            <div style={{ width: 200, textAlign: 'center' }}>
                {status ? "Đã duyệt" : <button onClick={onUpdate}>Duyệt</button>}
            </div>
        </Box>
    </>
    )
}

export default PostStatus