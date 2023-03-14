import React from 'react'
import { graphql, withPrefix } from 'gatsby'
import Image from "gatsby-image"
import styled from 'styled-components'
import { createGlobalStyle } from 'styled-components'

const GlobalPageStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: Montserrat,sans-serif;
  }
`

const Wrapper = styled.div`
  width: ${props => props.width || 440}px;
  height: ${props => props.height || 220}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
  text-align: center;
  background-color: white;
  position: relative;
`

const Square = styled.div`
  width: ${props => props.width || 440}px;
  height: ${props => props.height || 220}px;
  position: absolute;
  outline: 3px solid red !important;
  outline-offset: -25px;
`

const Preview = styled.div`
  width: ${props => props.width || 440}px;
  height: ${props => props.height || 220}px;
  background-image: url('${props =>
    props.hero || withPrefix(props.siteCover)}');
  background-position: center;
  background-size: cover;
  position: absolute;
  opacity: 0.1;
`

const Title = styled.h1`
  font-weight: 600;
  font-size: 1.2rem;
  font-style: italic;
  font-family: 'Merriweather','Georgia',serif;
  margin: 10px 60px;
  color: hsla(0,0%,0%,0.59);
  text-shadow: 1px 1px 4px rgba(34, 34, 34, 0.6) gray;
  text-align: center;
  z-index: 1;
`

const SiteTitle = styled.p`
  font-size: 1rem;
  left: 50%;
  font-weight: 700;
  text-align: center;
  z-index: 1;
  position: absolute;
  top: 8px;
  color: white;
  background-color: red;
  padding: 1px 5px 1px 5px;
  margin-bottom: 5px;
  transform: translate(-50%);
  width: max-content;
`

const SubTitle = styled.div`
  vertical-align: middle;
  text-align: center;
  font-weight: 500;
  z-index: 1;
`

const BlogPostShareImage = props => {
  const post = props.data.markdownRemark

  const authorImage = props.data.authorImage.childImageSharp.fixed
  const defaultPreviewImage = props.data.defaultPreviewImage.childImageSharp.fixed
  const { width, height } = props.pageContext
  const heroImgUrl = post.frontmatter.imageShare?.publicURL || defaultPreviewImage.src

  return (
    <Wrapper width={width} height={height}>
      <link
        href="https://fonts.googleapis.com/css?family=Rubik&display=swap"
        rel="stylesheet"
      />
      <GlobalPageStyle />

      <SiteTitle>{post.frontmatter.title}</SiteTitle>

     {
        post.frontmatter.quote ? (
            <Title>
                "<i>{post.frontmatter.quote}</i>"<br/><br/>
                {post.frontmatter.quoteAuthor}
            </Title>
        ) : (
            <Title>
                
            </Title>
        )
     }
      {heroImgUrl && (
        <Preview
            hero={heroImgUrl}
        />
      )}
      <SubTitle>
        <Image
          className="bio-image"
          fixed={authorImage}
          width={32}
          height={32}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
          }}
        />
      </SubTitle>
      <Square width={width} height={height} />
    </Wrapper>
  )
}

export default BlogPostShareImage

export const pageQuery = graphql`
query BlogPostShareImage($slug: String!) {
    authorImage: file(absolutePath: { regex: "/lucasProfile.jpeg/" }) {
        childImageSharp {
            fixed(width: 64, height: 64) {
            ...GatsbyImageSharpFixed
            }
        }
    }
    defaultPreviewImage: file(absolutePath: { regex: "/defaultPreviewImage.jpeg/" }) {
        childImageSharp {
            fixed(width: 440, height: 220) {
            ...GatsbyImageSharpFixed
            }
        }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
        id
        excerpt(pruneLength: 120)
        frontmatter {
            title
            quote
            quoteAuthor
            imageShare {
                publicURL
            }
        }
    }
}
`