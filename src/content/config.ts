import {defineCollection, z} from 'astro:content';

const postsCollection = defineCollection({
    schema: z.object({
        author: z.string(),
        title: z.string(),
        date: z.string(),
        image: z.string(),
    })
})

// Includes all of the collections defined above - key name should match dir, e.g. "posts"
export const collections = {
    posts: postsCollection
}