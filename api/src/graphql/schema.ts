import { gql } from "apollo-server-koa";

const typeDefs = gql`
  type FeatureFlag {
    id: ID!
    active: Boolean!
    tableName: String # Adiciona o campo tableName
  }

  type GetFeatureFlagsResponse {
    featureFlags: [FeatureFlag!]!
    message: String
  }

  type Query {
    getFeatureFlags(tables: [String!]!): GetFeatureFlagsResponse!
  }

  type Mutation {
    setFeatureFlag(table: String!, id: ID!, active: Boolean!): FeatureFlag!
  }
`;

export default typeDefs;
