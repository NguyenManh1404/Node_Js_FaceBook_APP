import React from 'react'
import { Box } from '@admin-bro/design-system'
import { USER_ROLE } from '../../../utils/constant';

const toggleStyles = {
    container: {
        position: 'relative',
        display: 'inline-block',
        width: '60px',
        height: '34px',
    },
    input: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    slider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ccc',
        transition: '0.4s',
        borderRadius: '34px',
    },
    sliderBefore: {
        position: 'absolute',
        content: '',
        height: '26px',
        width: '26px',
        left: '4px',
        bottom: '4px',
        backgroundColor: 'white',
        transition: '0.4s',
        borderRadius: '50%',
    },
};

const UserStatus = (props) => {
    const isAdmin = props?.record?.params?.status
    return (<>
        <Box>
            <label style={toggleStyles.container}>
                <input
                    type="checkbox"
                    checked={isAdmin}
                    style={toggleStyles.input}
                />
                <span style={{ ...toggleStyles.slider, backgroundColor: isAdmin ? '#2196f3' : 'rgb(204, 204, 204)' }}></span>
                <span style={{ ...toggleStyles.sliderBefore, transform: isAdmin ? 'translateX(26px)' : 'translateX(0px)' }}></span>
            </label>
        </Box>
    </>
    )
}

export default UserStatus