import React from 'react'
import { Box } from '@admin-bro/design-system'
import axios from 'axios';
import { useRecords, useNotice } from 'admin-bro';
import { useHistory } from 'react-router-dom';

const RecipeStatus = (props) => {
    const sendNotice = useNotice()
    const history = useHistory()
    const {
        direction,
        sortBy,
        page,
        total,
        perPage, } = useRecords(props?.resource?.id);
    const status = props?.record?.params?.statusPost
    const onUpdate = async () => {
        try {
            await axios.put('/api/post/approve/' + props?.record?.params?._id);
            const search = new URLSearchParams()
            search.set('direction', direction);
            if (sortBy)
                search.set('sortBy', sortBy);
            search.set('page', String(page));
            search.set('total', String(total));
            search.set('perPage', String(perPage));
            history.push({ search: search.toString() })
            sendNotice({ message: 'Duyệt bài viết thành công', type: 'success' })
        } catch (error) {
            sendNotice({ message: 'Duyệt thất bại: ' + error?.message, type: 'error' })
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

export default RecipeStatus