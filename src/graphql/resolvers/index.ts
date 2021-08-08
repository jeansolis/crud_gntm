import { find, filter } from "lodash";
// import { find as ramdaFind, filter as ramdaFilter } from "ramda";

// Types
interface Author {
  id: number;
  firstName: string;
  lastName: string;
}
interface QueryAuthorAttributes {
  id: number;
}

interface Post {
  id: number;
  authorId: number;
  title: string;
  votes: number;
}
interface MutationUpdatePostAttributes {
  postId: number;
}

type QueryAuthor = (
  _: unknown,
  attrs: QueryAuthorAttributes
) => Author | undefined;
type QueryPosts = () => Array<Post>;
type MutationUpdatePost = (
  _: unknown,
  attrs: MutationUpdatePostAttributes
) => void;

type FilterPostsByAuthor = (author: Author) => Array<Post>;
type FindAuthorByPost = (post: Post) => Author | undefined;

// Example data

const authors: Array<Author> = [
  { id: 1, firstName: "Tom", lastName: "Coleman" },
  { id: 2, firstName: "Sashko", lastName: "Stubailo" },
  { id: 3, firstName: "Mikhail", lastName: "Novikov" },
];

const posts: Array<Post> = [
  { id: 1, authorId: 1, title: "Introduction to GraphQL", votes: 2 },
  { id: 2, authorId: 2, title: "Welcome to Meteor", votes: 3 },
  { id: 3, authorId: 2, title: "Advanced GraphQL", votes: 1 },
  { id: 4, authorId: 3, title: "Launchpad is Cool", votes: 7 },
];

// Query resolvers
const queryPosts: QueryPosts = () => posts;
const queryAuthor: QueryAuthor = (_, { id }) => find(authors, { id });

// Mutation resolvers
const mutationUpdatePost: MutationUpdatePost = (_, { postId }) => {
  const post = find(posts, { id: postId });
  if (!post) {
    throw new Error(`Couldn't find post with id ${postId}`);
  }
  post.votes += 1;
  return post;
};

const filterPostsByAuthor: FilterPostsByAuthor = (author) =>
  filter(posts, { authorId: author.id });

const findAuthorByPost: FindAuthorByPost = (post) =>
  find(authors, { id: post.authorId });

const resolvers = {
  Query: {
    posts: queryPosts,
    author: queryAuthor,
  },

  Mutation: {
    upvotePost: mutationUpdatePost,
  },

  Author: {
    posts: filterPostsByAuthor,
  },

  Post: {
    author: findAuthorByPost,
  },
};

export default resolvers;
