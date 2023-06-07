const AdminBro = require('admin-bro');
const { DefaultQuillToolbarOptions } = require("@admin-bro/design-system");
const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const PostResource = {
    resource: Recipe,
    options: {
        listProperties: ['name', 'linkVideo', 'images', 'cookTime', 'author', 'status'],
        parent: {
            name: 'Post Managerment',
            icon: 'Image',
        },
        toolbar: DefaultQuillToolbarOptions,
        properties: {
            images: {
                components: {
                    list: AdminBro.bundle('../component/Recipe/RecipeImage'),
                    show: AdminBro.bundle('../component/Recipe/RecipeImage'),
                },
            },
            status: {
                components: {
                    list: AdminBro.bundle('../component/Recipe/RecipeStatus'),
                },
            },
        },
        actions: {
            list: {
                // before: async (request, { currentAdmin }) => {
                //     request.query = {
                //         ...request.query,
                //         'filters.status': false,
                //     };
                //     return request;
                // },
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