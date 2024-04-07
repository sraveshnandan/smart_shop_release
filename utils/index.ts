import AsyncStorage from "@react-native-async-storage/async-storage";
import { GraphQLClient } from "graphql-request";

const gql_client = new GraphQLClient("https://gql-sravesh.koyeb.app/", {
  headers: {
    secret: "hi",
  },
});

let token = "";
AsyncStorage.getItem("token")
  .then((res: any) => {
    return (token = res);
  })
  .catch((e) => console.log("Token undefined"));

const getPercentage = (oldPrice: number, newPrice: number) => {
  const discount = oldPrice - newPrice;
  const unit = oldPrice / 100;
  const percentage = Number(discount / unit).toFixed(2);
  return percentage;
};

export { gql_client, getPercentage, token };
