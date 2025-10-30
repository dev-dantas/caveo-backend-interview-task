import { CognitoJwtVerifier } from "aws-jwt-verify";

import { env } from "../../config";

export const cognitoVerifier = CognitoJwtVerifier.create({
  userPoolId: env.lib.cognito.userPoolId,
  clientId: env.lib.cognito.clientId,
  tokenUse: "access",
});
