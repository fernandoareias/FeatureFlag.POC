import { gql } from "apollo-server-koa";

const typeDefs = gql`
  type FeatureFlag {
    id: ID!
    active: Boolean!
    tableName: String
    aliasName: String
  }

  type GetFeatureFlagsResponse {
    featureFlags: [FeatureFlag!]!
    message: String
  }

  type SetFeatureFlagsResponse {
    success: Boolean!
  }

  type Query {
    getFeatureFlags(tables: [String!]!): GetFeatureFlagsResponse!
  }

  type Mutation {
    setFeatureFlag(table: String!, active: Boolean!): SetFeatureFlagsResponse!
  }
`;

export default typeDefs;
