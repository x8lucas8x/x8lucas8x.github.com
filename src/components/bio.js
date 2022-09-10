/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

const Bio = () => {
  /**
   * STEP 2: Add the `fileRelativePath` and `rawJson` to your gatsby query
   */
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/lucasProfile.jpeg/" }) {
        childImageSharp {
          fixed(width: 64, height: 64) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      author: dataJson(pk: { eq: "author" }) {
        name
        description
        siteUrl
        social {
          twitter
          linkedin
          github
        }
      }
    }
  `)

  const {
    author: { name, social },
    avatar,
  } = data

  return (
    <div className="bio-container">
      <div className="bio-image-container">
        <Image
          className="bio-image"
          fixed={avatar.childImageSharp.fixed}
          width={64}
          height={64}
          alt={name}
        />
      </div>
      <div className="bio-content-container">
        <p>
          Written by <strong>{name}</strong>. You should follow him on
          {` `}
          <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>,{` `}
          <a href={`https://github.com/${social.github}`}>GitHub</a>, and{` `}
          <a href={`https://linkedin.com/in/${social.linkedin}`}>LinkedIn</a>.
        </p>
      </div>
    </div>
  )
}

export default Bio
