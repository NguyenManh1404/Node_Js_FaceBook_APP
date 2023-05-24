const Post = require("./src/models/Post");
const User = require("./src/models/User");
const Category = require("./src/models/Category");
const Recipe = require("./src/models/Recipe");
const { DefaultQuillToolbarOptions } = require("@admin-bro/design-system");
const AdminBro = require('admin-bro')

const postManage = {
  name: 'Post Managerment',
  icon: 'Image',
}

const resources = [
  {
    resource: User,
    options: {
      parent: {
        name: 'User Managerment',
        icon: 'User',
      },
      properties: {
        avatar: {
          components: {
            list: AdminBro.bundle('./component/UserImage'),
            show: AdminBro.bundle('./component/UserImage'),
          },
        },
        fullName: {
          name: "Full name",
          type: "String"
        },
      },
    }
  },
  {
    resource: Post,
    options: {
      name: "List of Post",
      parent: postManage,
      toolbar: DefaultQuillToolbarOptions,
      properties: {
        imagePost: {
          components: {
            list: AdminBro.bundle('./component/PostImage'),
            show: AdminBro.bundle('./component/PostImage'),
          },
        },
      },
    }
  }, Category, Recipe]

const pages =
{
  "Quản lý": {
    handler: async (request, response, context) => {
      return {
        text: 'I am fetched from the backend',
      }
    },
    component: AdminBro.bundle('./component/Custom'),
  },
}

const dashboard = {
  component: AdminBro.bundle('./component/Custom'),
}
module.exports = { resources, pages, dashboard }