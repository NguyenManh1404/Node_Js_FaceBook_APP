const bcrypt = require('bcrypt');
const User = require('../../models/User');
const AdminBro = require('admin-bro')

const UserResource = {
    resource: User, // Replace with your User model
    options: {
        listProperties: ['avatar', 'fullName', 'email', 'role', 'phoneNumber', 'status'],
        parent: {
            name: 'User Management',
            icon: 'User',
        },
        actions: {
            edit: {
                isVisible: true,
                before: async (request, { currentAdmin }) => {
                    if ('password' in request.payload && request.payload.password !== '') {
                        const hashedPassword = await bcrypt.hash(request.payload.password, 10);
                        request.payload.password = hashedPassword;
                    }
                    return request;
                },
            },
            new: {
                isVisible: true,
                before: async (request, { currentAdmin }) => {
                    if ('password' in request.payload && request.payload.password !== '') {
                        const hashedPassword = await bcrypt.hash(request.payload.password, 10);
                        request.payload.password = hashedPassword;
                    }
                    return request;
                },
            },
        },
        properties: {
            password: {
                isVisible: {
                    list: false,
                    show: false,
                    edit: true,
                    filter: false,
                },
            },
            firstName: {
                isVisible: {
                    list: true,
                    show: false,
                    edit: true,
                    filter: true,
                },
            },
            lastName: {
                isVisible: {
                    list: true,
                    show: false,
                    edit: true,
                    filter: true,
                },
            },
            updatedAt: {
                isVisible: {
                    list: false,
                    show: false,
                    edit: false,
                    filter: false,
                },
            },
            createdAt: {
                isVisible: {
                    list: false,
                    show: true,
                    edit: false,
                    filter: false,
                },
            },
            isVerifyEmail: {
                isVisible: {
                    list: false,
                    show: true,
                    edit: false,
                    filter: false,
                },
            },
            _id: {
                isVisible: {
                    filter: false,
                },
            },
            avatar: {
                name: 'Avatar',
                components: {
                    list: AdminBro.bundle('../component/User/UserImage'),
                    show: AdminBro.bundle('../component/User/UserImage'),
                    edit: AdminBro.bundle('../component/User/AvatarUpload'),
                },
                isVisible: {
                    filter: false,
                },
            },
            fullName: {
                name: 'User Name',
                type: 'string',
                components: {
                    list: AdminBro.bundle('../component/User/UserFullname'),
                    show: AdminBro.bundle('../component/User/UserFullname'),
                },
                isVisible: {
                    filter: false,
                },
            },
            emailVerificationCode: {
                isVisible: {
                    create: false,
                    list: false,
                    show: false,
                    edit: false,
                    filter: false,
                },
            }
        },
    },
};

module.exports = UserResource