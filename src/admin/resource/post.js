const AdminBro = require('admin-bro');
const Post = require('../../models/Post');
const { DefaultQuillToolbarOptions } = require("@admin-bro/design-system");
const User = require('../../models/User');
const PostResource = {
    resource: Post,
    options: {
        listProperties: ['imagePost', 'statusPost'],
        parent: {
            name: 'Post Managerment',
            icon: 'Image',
        },
        toolbar: DefaultQuillToolbarOptions,
        properties: {
            imagePost: {
                components: {
                    list: AdminBro.bundle('../component/Post/PostImage'),
                    show: AdminBro.bundle('../component/Post/PostImage'),
                },
            },
            statusPost: {
                components: {
                    list: AdminBro.bundle('../component/Post/PostStatus'),
                },
            },
            statusPost: {
                components: {
                    list: AdminBro.bundle('../component/Post/PostStatus'),
                },
            },
        },
        actions: {
            list: {
                before: async (request, { currentAdmin }) => {
                    request.query = {
                        ...request.query,
                        'filters.statusPost': false,
                    };
                    return request;
                },
                after: [
                    async (response, request) => {
                        if (!(request.method.toLowerCase() === 'get')) {
                            return response;
                        }
                        for (const record of response.records) {
                            const idUser = record.params.idUser;
                            const user = await User.findById(idUser);
                            record.params.user = user
                        }

                        return response;
                    }],
            },
        },

    }
}

module.exports = PostResource