const Post = require("../models/Post");
const User = require("../models/User");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const { DefaultQuillToolbarOptions } = require("@admin-bro/design-system");
const AdminBro = require('admin-bro')

const UserResource = require("./resource/user");
const PostResource = require("./resource/recipe");



const resources = [
  UserResource,
  PostResource,
  {
    resource: Category,
    options: {
      parent: {
        name: 'Category Managerment',
        icon: 'Image',
      },
      toolbar: DefaultQuillToolbarOptions,
    }
  },
]

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