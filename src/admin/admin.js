const Post = require("../models/Post");
const User = require("../models/User");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
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
      listProperties: ['avatar', 'fullName', 'email', 'role', 'phoneNumber', 'createdAt', 'status'],
      parent: {
        name: 'User Managerment',
        icon: 'User',
      },
      properties: {
        avatar: {
          name: "Avatar",
          components: {
            list: AdminBro.bundle('./component/User/UserImage'),
            show: AdminBro.bundle('./component/User/UserImage'),
            edit: AdminBro.bundle('./component/User/AvatarUpload'),
          },
        },
        fullName: {
          name: "User name",
          type: 'string',
          components: {
            list: AdminBro.bundle('./component/User/UserFullname'),
            show: AdminBro.bundle('./component/User/UserFullname'),
          },
        },
        createdAt: {
          name: "DateCreater",
        },
        status: {
          components: {
            list: AdminBro.bundle('./component/User/UserStatus'),
          },
        }
      },
    }
  },
  {
    resource: Post,
    options: {
      listProperties: ['imagePost', 'statusPost'],
      parent: postManage,
      toolbar: DefaultQuillToolbarOptions,
      properties: {
        imagePost: {
          components: {
            list: AdminBro.bundle('./component/Post/PostImage'),
            show: AdminBro.bundle('./component/Post/PostImage'),
          },
        },
        statusPost: {
          components: {
            list: AdminBro.bundle('./component/Post/PostStatus'),
          },
        },
      },
      // actions: {
      //   approve: {
      //     actionType: ['record'],
      //     label: 'Publish',
      //     icon: 'fas fa-eye',
      //     isVisible: true,
      //     handler: async (request, response, context) => {

      //       return {
      //         record: request,
      //       }
      //     },
      //     before: [],
      //     after: null,
      //     //component: AdminBro.bundle('./component/Post/PostList'),
      //   },
      // },
    }
  },
  Category,
  {
    resource: Post,
    options: {
      listProperties: ['imagePost', 'statusPost'],
      parent: postManage,
      toolbar: DefaultQuillToolbarOptions,
      properties: {
        imagePost: {
          components: {
            list: AdminBro.bundle('./component/Post/PostImage'),
            show: AdminBro.bundle('./component/Post/PostImage'),
          },
        },
        statusPost: {
          components: {
            list: AdminBro.bundle('./component/Post/PostStatus'),
          },
        },
      },
    }
  }]

const pages =
{
  "Quản lý": {
    handler: async (request, response, context) => {
      return {
        text: 'I am fetched from the backend',
      }
    },
    component: AdminBro.bundle('./pages/Custom'),
  },
}

const dashboard = {
  component: AdminBro.bundle('./pages/Custom'),
}
module.exports = { resources, pages, dashboard }