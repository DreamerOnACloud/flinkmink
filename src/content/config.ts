import {defineCollection, z} from 'astro:content';


const postsCollection = defineCollection({
    schema: ({image}) => z.object({ // 'image()' is imported implicitly and available the moment we define 'schema' as a (arrow) function
        author: z.string(),
        title: z.string(),
        date: z.string(),
        image: image(),
        description: z.string(),
    })
})

const projectsCollection = defineCollection({
    schema: ({image}) => z.object({ // 'image()' is imported implicitly and available the moment we define 'schema' as a (arrow) function
        title: z.string(),
        image: image(),
        url: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
    })
})

// Includes all of the collections defined above - key name should match dir, e.g. "posts"
export const collections = {
    posts: postsCollection,
    projects: projectsCollection
}