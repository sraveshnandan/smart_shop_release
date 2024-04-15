import { GraphQLClient } from "graphql-request";
const gql_client = new GraphQLClient("https://gql-sravesh.koyeb.app/", {
  headers: {
    secret: "hi",
  },
});

const getPercentage = (oldPrice: number, newPrice: number) => {
  const discount = oldPrice - newPrice;
  const unit = oldPrice / 100;
  const percentage = Number(discount / unit).toFixed(2);
  return percentage;
};

export { gql_client, getPercentage };
