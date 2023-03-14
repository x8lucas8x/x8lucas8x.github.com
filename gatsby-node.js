const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blogPost.js`)
  const blogPostPreview = path.resolve(`./src/templates/blogPostPreview.js`)

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                slug
                title
                date
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    const slug = post.node.fields.slug;
    const context = {
      slug,
      previous,
      next,
    };

    // create the blog post page
    createPage({
      path: slug,
      component: blogPost,
      context: context,
    });

    if (process.env.gatsby_executing_command.includes('develop')) {
      // create the blog post page preview
      createPage({
        path: `${slug}/preview_image`,
        component: blogPostPreview,
        context: context,
      });
    }
  });
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value: `/${node.frontmatter.slug}`,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      slug: String
      title: String!
      date: Date @dateformat(formatString: "DD-MM-YYYY")
      tags: [String!]
      imageShare: File @fileByRelativePath
      socialShare: File! @fileByRelativePath
    }
  `
  createTypes(typeDefs)
}
